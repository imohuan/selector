import { describe, expect, it } from "vitest";

import { defaultReplaces } from "../src/core/config";
import { parseReplace } from "../src/core/query";
import { sj } from "../src/core/str";

describe("工具方法测试", () => {
  it("Sj 函数 截取字符串测试", async () => {
    const content = "{  url: 'https://22222', sdf: 'https://33333' }";
    expect(sj(content, "{", "}")).toBe(content);
    expect(sj(content, "{", "}", "first", true)).toBe(content.slice(1, -1));
    expect(sj(content, "https:", "'", "last", false)).toBe("https://33333'");
    expect(sj(content, "https:", "'", "first", false)).toBe("https://22222'");
    expect(sj(content, "'", "'", "last", true)).toBe("https://33333");
    expect(sj(content, "'", "'", "first", true)).toBe("https://22222");
  });

  it("Replace 替换自定义的class为可以使用的class", async () => {
    expect(parseReplace(".hello:eq(3) .ddd:eq(-1)::text", defaultReplaces)).toBe(
      ".hello:nth-of-type(3) .ddd:nth-last-of-type(1)::text"
    );
    expect(parseReplace(".hello:eq(2n+1) .ddd:eq(2n+1)::text", defaultReplaces)).toBe(
      ".hello:nth-of-type(2n+1) .ddd:nth-of-type(2n+1)::text"
    );
    expect(parseReplace(".hello:ed(3) .ddd:ed(-1)::text", defaultReplaces)).toBe(
      ".hello:nth-child(3) .ddd:nth-last-child(1)::text"
    );
    expect(parseReplace(".hello:ed(2n+1) .ddd:ed(2n+1)::text", defaultReplaces)).toBe(
      ".hello:nth-child(2n+1) .ddd:nth-child(2n+1)::text"
    );
  });
});
