import { returnDefault } from "./config";

/**
 * 解决字符串
 * @param content 需要截取的字符串
 * @param start 开始的字符串
 * @param end 结束的字符串
 * @param mode 模式：从字符串左边或右边开始截取 (first | last)
 * @param replaceTrim 是否去除两边截取的内容
 * @returns
 */
export function sj(
  content: string,
  start: string,
  end: string,
  mode: "first" | "last" = "first",
  replaceTrim: boolean = false
): string | null {
  if (mode === "first") {
    const startIndex = content.indexOf(start);
    const endIndex = content.slice(startIndex + 1).indexOf(end) + (replaceTrim ? 0 : end.length);
    if (startIndex === -1 || endIndex === -1) return returnDefault;
    return content.slice(startIndex + (replaceTrim ? start.length : 0), startIndex + endIndex + 1);
  } else if (mode === "last") {
    const endIndex = content.lastIndexOf(end);
    const startIndex = content.slice(0, endIndex).lastIndexOf(start);
    return content.slice(
      startIndex + (replaceTrim ? start.length : 0),
      endIndex + (replaceTrim ? 0 : end.length)
    );
  }
  return returnDefault;
}
