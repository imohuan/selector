import { describe, expect, it } from "vitest";
import { getSelector, JSONSelector } from "../src/index";

const data = {
  hello: "world",
  pageFor: "page",
  count: 3,
  arr: [1, 2, 3]
};

const json = {
  ...data,
  page: 1,
  size: 10,
  list: [
    { title: "title1", url: "https://22222", tag: [1, 2, 3, 4, 5] },
    { title: "title2", url: "https://33333", tag: [11, 22, 33, 44, 55] }
  ]
};

describe("Parser 解析", () => {
  it("JsonParser 解析JSON", async () => {
    const selector = new JSONSelector(json, data);
    expect(selector.query({ value: "pageFor[0]|hello" })).toBe("p");
    expect(selector.query({ value: "xxxx|hello" })).toBe("world");
    expect(selector.query({ value: "xxx| xxxx xc x x| xxx|hello" })).toBe("world");
    expect(selector.query({ value: "count" })).toBe(3);
    expect(selector.query({ value: "*{hello}_{pageFor}" })).toBe("world_page");
    expect(selector.query({ value: "{pageFor}" })).toBe(1);

    const result1 = selector.queryParent("list", [
      { name: "title", value: "title" },
      { name: "url", value: "urlx|tag" }
    ]);
    expect(result1).toEqual([
      { title: "title1", url: [1, 2, 3, 4, 5] },
      { title: "title2", url: [11, 22, 33, 44, 55] }
    ]);

    const result2 = selector.queryParent("list", [
      { name: "title", value: "title" },
      { name: "url", value: "tag" }
    ]);
    expect(result2).toEqual([
      { title: "title1", url: [1, 2, 3, 4, 5] },
      { title: "title2", url: [11, 22, 33, 44, 55] }
    ]);

    const result3 = selector.queryData([
      { name: "page", value: "page" },
      { name: "size", value: "size" },
      {
        name: "lists",
        parent: "list",
        children: [
          { name: "t", value: "title" },
          { name: "URL", value: "url" },
          { name: "global_page", value: "!xx|!page" },
          { name: "global_size", value: "!size" }
        ]
      }
    ]);
    expect(result3).toEqual({
      page: 1,
      size: 10,
      lists: [
        { t: "title1", URL: "https://22222", global_page: 1, global_size: 10 },
        { t: "title2", URL: "https://33333", global_page: 1, global_size: 10 }
      ]
    });
  });

  it("DataParser 解析HTML", async () => {
    const html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        <div class="head">
          <span>经济xxx</span>
        </div>

        <ul>
          <li id="xxx">
            <div class="title">       标题1          </div>
            <div class="description">描述1</div>
            <div class="tags"><span class="tag">1</span> <span class="tag">2</span></div>
          </li>
          <li>
            <div class="title">标题2      </div>
            <div class="description">描述2</div>
            <div class="tags"><span class="tag">1</span><span class="tag">2</span></div>
          </li>
          <li>
            <div class="title">标题3</div>
            <div class="description">描述3</div>
            <div class="tags"><span class="tag">1</span><span class="tag">2</span></div>
          </li>
        </ul>
      </body>
    </html>
    `;
    // const parser = new DataParser<any>(html, {});
    const parser = getSelector(html, { name: "name-123", age: 123 }); // parser = DataParser

    expect(parser.query({ cls: ".head::text", rules: ["trim"] })).toBe("经济xxx");
    expect(parser.query({ cls: ".what::text|.dddd::text|.head::text", rules: ["trim"] })).toBe(
      "经济xxx"
    );

    const result1 = parser.queryParent("ul li", [
      { name: "title", cls: ".title::text", rules: ["trim"] },
      { name: "description", cls: ".description::text", rules: ["trim"] },
      {
        name: "tags",
        parent: ".tag",
        children: [{ name: "tag", cls: "_::text" }]
      }
    ]);
    expect(result1).toEqual([
      { title: "标题1", description: "描述1", tags: [{ tag: "1" }, { tag: "2" }] },
      { title: "标题2", description: "描述2", tags: [{ tag: "1" }, { tag: "2" }] },
      { title: "标题3", description: "描述3", tags: [{ tag: "1" }, { tag: "2" }] }
    ]);

    const result2 = parser.queryParent("ul li .title", [
      { name: "content", cls: "_::text", rules: ["trim"] }
    ]);
    expect(result2).toEqual([{ content: "标题1" }, { content: "标题2" }, { content: "标题3" }]);

    const result3 = parser.queryData([
      {
        name: "head",
        cls: ".head::text",
        rules: ["trim"],
        processing: (data, option) => {
          return data;
        }
      },
      {
        name: "list",
        parent: "ul li",
        children: [
          { name: "title", cls: ".title::text", rules: ["trim"] },
          { name: "description", cls: ".description::text", rules: ["trim"] },
          { name: "tags", parent: ".tag", children: [{ name: "tag", cls: "_::text" }] }
        ]
      }
    ]);
    expect(result3).toEqual({
      head: "经济xxx",
      list: [
        { title: "标题1", description: "描述1", tags: [{ tag: "1" }, { tag: "2" }] },
        { title: "标题2", description: "描述2", tags: [{ tag: "1" }, { tag: "2" }] },
        { title: "标题3", description: "描述3", tags: [{ tag: "1" }, { tag: "2" }] }
      ]
    });

    const result4 = parser.queryData([
      {
        name: "list",
        parent: "ul li",
        children: [{ name: "title", cls: "!.head::text", rules: ["trim"] }]
      }
    ]);
    expect(result4).toEqual({
      list: [{ title: "经济xxx" }, { title: "经济xxx" }, { title: "经济xxx" }]
    });
  });
});
