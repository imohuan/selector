import { get, isEmpty, isNumber, isString } from "lodash-es";
import { returnDefault } from "./config";

/** 字符串去除前后空格 */
export function trim(value: string) {
  return isString(value) ? value.trim() : value;
}

/** 将字符串解析成 整数 */
export function int(value: any) {
  if (isNumber(value)) return Math.ceil(value);
  if (!isString(value)) return returnDefault;
  const num = parseInt(value);
  return isNaN(num) ? returnDefault : num;
}

/** 将字符串解析成 浮点数 */
export function float(value: any) {
  if (isNumber(value)) return value;
  if (!isString(value)) return returnDefault;
  const num = parseFloat(value);
  return isNaN(num) ? returnDefault : num;
}

/** 过滤空数据 */
export function filterEmpty(value: any[]) {
  return value.filter((f) => !isEmpty(f));
}

/** 补全URl */
export function url(value: any, global: any) {
  const option = {
    httpType: get(global, "httpType", "https"),
    origin: get(global, "origin", "")
  };

  if (!value || !isString(value)) return value;
  if (value.startsWith("//")) return `${option.httpType}:${value}`;
  if (value.startsWith("/")) return `${option.origin}${value}`;
  return `${option.origin}/${value}`;
}

/** JSON格式化 */
export function json(value: any) {
  try {
    return JSON.parse(value);
  } catch {
    return returnDefault;
  }
}
