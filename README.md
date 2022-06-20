## 案例

```typescript
import { getSelector } from "im-selector";
// const { getSelector } = require("im-selector"); // 也可以
const html = `<a href="#1">1</a>
              <a href="#2">2</a>
              <a href="#3">3</a>
              <a href="#4">4</a>
              <a href="#5">5</a>
              <a href="#6">6</a>
              <a href="#7">7</a>
              <a href="#8">8</a>
              <a href="#9">9</a>
              <a href="#10">10</a>`;
const parser = Selector.getSelector(html, { name: "im-selector" });
console.log("使用变量", parser.query({ cls: "*{name}" }));
console.log("多个Class找到存在的值", parser.query({ cls: ".xxx::text|a::text", rules: ["trim"] }));
console.log("全选", parser.query({ cls: "@a::text", rules: ["trim"] }));
```

## 选择器

- **常用选择器**
- id 选择 `#app`
- class 选择 `.app`
- 标签选择 `span`
- 后代 `div span`
- 子代 `div > span`
- 邻接兄弟 `span + div`
- 通用兄弟 `span ~ div`
- **属性选择**
- 存在属性 `span[attr] => a[title]`
- 属性相等 `span[attr=value] => a[href="https://example.com"]`
- 包含(空格分开) `[attr~=value] => li[class~="a"]`
- 开头等于或则已 zh-开头 `[attr|=value] => div[lang|="zh"]`
- 开头包含 `[attr^=value] => a[src^="https"]`
- 结尾包含 `[attr$=value] => a[src$=".vue"]`
- 包含 `[attr*=value] => a[src*="hello"]`
- **伪类**
- `:eq(1)` -> `:last-of-type(1)`
- `:eq(-1)` -> `:nth-last-of-type(1)`
- `:ed(1)` -> `:last-child(1)`
- `:ed(-1)` -> `:nth-last-child(1)`

  - `:nth-child(2n+1)` -> `span:nth-child(-n+3)`选择父级下面第几个元素
  - `:last-of-type` 选择同级同元素的最后一个
  - `:last-child` 选择父元素下最后一个元素
  - `:nth-of-type` 选择父级下面同类型的第几个元素
  - `:nth-last-child`
  - `:nth-last-of-type`

> CSS 伪类首先找到所有当前元素的兄弟元素，然后按照位置先后顺序从 1 开始排序，选择的结果为 CSS 伪类\* `:nth-child` 括号中表达式（`an+b`）匹配到的元素集合（`n=0，1，2，3...`）

- `:not(选择器)` 匹配作为值传入自身的选择器未匹配的物件
- `:only-child`选择没有兄弟的元素
- `:only-of-type` 选择同级没有相同元素的元素
