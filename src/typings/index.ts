import * as ruleFunctions from "../core/rule";

export interface Parser {
  attr(prop: string): string | null;
  html(): string | null;
  text(): string | null;
  first(): Parser | null;
  last(): Parser | null;
  queryRoot(): Parser;
  querySelector(selector: string): Parser | null;
  querySelectorAll(selector: string): ParserArray;
}

export interface ParserArray {
  first(): Parser | null;
  last(): Parser | null;
  queryRoot(): Parser;
  each(callback: (value: Parser, index: number, all: Parser[]) => void): void;
}

export interface QueryChar {
  /** 获取 `querySelectorAll` (默认: `@`) */
  all: string;
  /** 获取 `document.documentElement.querySelector` (默认: `!`)*/
  root: string;
  /** 获取 循环根部 (默认: `_`)*/
  current: string;
  /** 模板替换变量 (默认: `/\{([_a-zA-Z0-9]+)}/g`)*/
  var: RegExp;
  /** 不进行获取, 直接返回 * 后面的内容 (默认: `*`)*/
  no: string;
}

export type QueryReplace = [RegExp, (value: string, ...args: string[]) => any, string];

export type EmitterEvent = {
  files: {
    key: string;
    value: any;
    keys: string[];
    filterKeys: string[];
    data: any;
  };
};

export type RuleItem = keyof typeof ruleFunctions;
export type ProcessingOption<T> = T & {
  [key: string]: any;
};

export interface QueryOption<T> {
  cls: string;
  char: QueryChar;
  rules: RuleItem[];
  parent: string | ParserArray;
  processing: (data: any, option?: ProcessingOption<T>) => any;
  replaces: QueryReplace[];
}

export type QueryJsonOption<T> = Omit<QueryOption<T>, "cls" | "replaces" | "parent"> & {
  value: string;
  parent: string;
};

export type HTMLSelectorOption<T> = {
  cls?: string | string[];
  name?: string;
  parent?: any;
  children?: HTMLSelectorOption<T>[];
  [key: string]: any;
} & Partial<Omit<QueryOption<T>, "cls">>;

export type JSONSelectorOption<T> = {
  value?: string | string[];
  name?: string;
  parent?: any;
  children?: JSONSelectorOption<T>[];
  [key: string]: any;
} & Partial<Omit<QueryJsonOption<T>, "value">>;
