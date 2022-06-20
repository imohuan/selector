import Parser from "#parser";
import { HTMLSelector, JSONSelector } from "./core/parser";

export * from "./core/str";
export * from "./core/parser";

export function getSelector<T>(data: any, global: T) {
  try {
    return new JSONSelector<T>(JSON.parse(data), global);
  } catch {
    return new HTMLSelector<T>(new Parser(data), global);
  }
}
