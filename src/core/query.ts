import { defaultsDeep, get, isArray, isFunction, isString } from "lodash-es";

import {
  Parser,
  ParserArray,
  QueryChar,
  QueryReplace,
  QueryOption,
  QueryJsonOption
} from "../typings";
import { defaultChar, defaultReplaces, returnDefault } from "./config";
import * as ruleFunctions from "./rule";

export const queryKeys = ["cls", "rules", "parent", "processing", "char", "replaces"];
export const queryJsonKeys = ["value", "rules", "parent", "processing", "char"];

/** 返回数据进行 processing 后第二次执行处理 */
export function parseRule<T>(value: any, global: T, rules: QueryOption<any>["rules"]): string {
  try {
    rules.forEach((rule) => {
      const func = get(ruleFunctions, rule, returnDefault) as (data: any, global: any) => void;
      if (!isFunction(func)) return;
      if (
        ["List", "Array", "list", "array"].some((m) => rule.endsWith(m)) ||
        ["filter", "sort"].some((m) => rule.startsWith(m))
      ) {
        value = func(value);
      } else {
        value = isArray(value) ? value.map((item) => func(item, global)) : func(value);
      }
    });
  } catch {}
  return value;
}

/** 替换 */
export function parseReplace(value: string, replaces: QueryReplace[]) {
  replaces.forEach((item) => {
    const [regexp, callback] = item;
    if (!regexp || !callback) return;
    value = value.replace(regexp, callback);
  });
  return value;
}

/** 解析 cls 变成可以直接 querySelector使用的cls, 并且获取其操作名称 */
export function parseClass(str: string): { cls: string; name: string; attr: string } | null {
  const regexp = /(.+)::(html|text|attr\((.+)\))$/;
  const value = regexp.exec(str);
  if (!value) return null;
  return { cls: value[1], name: value[2], attr: value[3] };
}

/** 执行用户自定义的数据处理, 支持字符串函数 */
export function parseProcessing<T>(
  value: any,
  processing: QueryOption<T>["processing"] | string,
  global: any
) {
  try {
    if (isString(processing)) {
      const callback = new Function(`return ${processing}`)();
      return isFunction(callback) ? callback(value, global) : value;
    } else if (isFunction(processing)) {
      return processing(value, global);
    } else return value;
  } catch (e: any) {
    console.error(`Processing Error: \nmessage: ${e.message}\ndata: ${String(processing)}`);
    return value;
  }
}

/** 获取 char 匹配的 parser */
export function getCharParser(
  parser: Parser,
  cls: string,
  char: QueryChar
): Parser | ParserArray | null {
  const all = cls.startsWith("@");
  if (all) cls = cls.slice(1);

  if (cls.startsWith(char.current)) return parser;
  if (cls.startsWith(char.root)) {
    cls = cls.slice(1);
    const root = parser.queryRoot();
    return all ? root.querySelectorAll(cls) : root.querySelector(cls);
  }

  return all ? parser.querySelectorAll(cls) : parser.querySelector(cls);
}

export function getQueryItem(parser: Parser, name: string, attr: string): any {
  if (attr) return parser.attr(attr) || returnDefault;
  if (name === "html") return parser.html() || returnDefault;
  if (name === "text") return parser.text() || returnDefault;
  return returnDefault;
}

/** 获取parser对应的cls数据 */
export function getQueryData(parsers: Parser | ParserArray, name: string, attr: string): any {
  const isArray = !!(parsers as any)?.each;
  if (isArray) {
    const result: any[] = [];
    (parsers as ParserArray).each((item) => {
      result.push(getQueryItem(item, name, attr));
    });
    return result;
  }
  return getQueryItem(parsers as Parser, name, attr);
}

export function query<T = any>(
  parser: Parser,
  userOption: Partial<QueryOption<T>> & Pick<QueryOption<T>, "cls">,
  global: T
): string | any[] | null {
  let { cls, rules, parent, processing, char, replaces }: QueryOption<T> = defaultsDeep(
    userOption,
    {
      rules: [],
      replaces: [],
      processing: (data: any) => data,
      char: defaultChar
    } as Partial<QueryOption<T>>
  );

  // 判断cls是否为空，或则不存在
  if (!cls || !cls.trim()) return returnDefault;
  cls = cls.trim();

  // 判断cls是否是变量
  if (char.var.test(cls)) {
    // .hello {cls} | *{what}_{origin}_{cls}
    cls = cls.replace(char.var, (word: string) => get(global, word.slice(1, -1), returnDefault));
  }

  // 判断是否不需要进行解析的cls
  if (cls.startsWith(char.no)) {
    const _result = parseProcessing<T>(cls.slice(1), processing, global);
    return parseRule<T>(_result, global, rules);
  }

  const clsObj = parseClass(cls);
  if (!clsObj) return returnDefault;
  clsObj.cls = parseReplace(clsObj.cls, defaultReplaces.concat(replaces));

  let result: any = returnDefault;
  if (parent) {
    result = [];
    const current = isString(parent)
      ? parser.querySelectorAll(parent as string)
      : (parent as ParserArray);
    if (!current) return returnDefault;
    current.each((item) => {
      const parser = getCharParser(item, clsObj.cls, char);
      if (!parser) return result.push(returnDefault);
      result.push(getQueryData(parser, clsObj.name, clsObj.attr));
    });
  } else {
    const current = getCharParser(parser, clsObj.cls, char);
    if (!current) return returnDefault;
    result = getQueryData(current, clsObj.name, clsObj.attr);
  }

  const _result = parseProcessing<T>(result, processing, global);
  return parseRule<T>(_result, global, rules);
}

export function queryJson<T = any>(
  datas: { global: any; current: any },
  userOption: Partial<QueryJsonOption<T>> & Pick<QueryJsonOption<T>, "value">,
  global: T
): string | any[] | null {
  const { global: globalData, current: data } = datas;
  let { value, rules, parent, processing, char }: QueryJsonOption<T> = defaultsDeep(userOption, {
    rules: [],
    replaces: [],
    processing: (data: any) => data,
    char: defaultChar
  } as Partial<QueryJsonOption<T>>);

  if (!value || !value.trim()) return returnDefault;
  value = value.trim();

  // 判断cls是否是变量
  if (char.var.test(value)) {
    // .hello {cls} | *{what}_{origin}_{cls}
    value = value.replace(char.var, (word: string) =>
      get(global, word.slice(1, -1), returnDefault)
    );
  }

  // 判断是否不需要进行解析的cls
  if (value.startsWith(char.no)) {
    const _result = parseProcessing<T>(value.slice(1), processing, global);
    return parseRule<T>(_result, global, rules);
  }

  const isRoot = value.startsWith(char.root);
  const isCurrent = value.startsWith(char.current);
  if (isRoot || isCurrent) value = value.slice(1);
  const getValue = (currentData: any) => {
    return isCurrent ? currentData : get(isRoot ? globalData : currentData, value, returnDefault);
  };

  let result: any = null;
  if (parent) {
    result = [];
    const currents: any[] = get(data, parent, returnDefault);
    if (!currents || !isArray(currents)) return returnDefault;
    currents.forEach((current) => result.push(getValue(current)));
  } else {
    result = getValue(data);
  }
  return parseRule<T>(parseProcessing<T>(result, processing, global), global, rules);
}
