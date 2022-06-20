import { HTMLSelector, JSONSelector } from "./core/parser";
import { NodeParser } from "./dom/node";

export * from "./core/str";
export * from "./core/parser";
export { NodeParser } from "./dom/node";

export function getSelector<T>(data: any, global: T) {
  try {
    return new JSONSelector<T>(JSON.parse(data), global);
  } catch {
    return new HTMLSelector<T>(new NodeParser(data), global);
  }
}
