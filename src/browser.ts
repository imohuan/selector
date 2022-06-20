import { HTMLSelector, JSONSelector } from "./core/parser";
import { BrowserParser } from "./dom/browser";
import { isObject } from "lodash-es";

export * from "./core/str";
export * from "./core/parser";
export { BrowserParser } from "./dom/browser";

/**
 * 统一获取 Parser
 * @param data 需要解析的数据， html字符串|json对象|json字符串
 * @param global 设置全局数据，提供后期解析使用
 * @returns JsonParser | DataParser 对象
 */
export function getSelector<T>(data: any, global: T) {
  try {
    if (isObject(data)) return new JSONSelector<T>(data, global);
    else return new JSONSelector<T>(JSON.parse(data), global);
  } catch {
    return new HTMLSelector<T>(new BrowserParser(data), global);
  }
}
