## 命令

- 监听编译 `pnpm dev`
- `Esbuild`监听编译 `pnpm esbuild:dev`
- 项目编译 `pnpm build`
- 编译预览 `pnpm preview`
- 执行测试 `pnpm test`
- 发布 `npm login && npm publish`

## 测试

- `vitest`

## 基础目录

- `src` 资源目录
- `test` 测试
- `typings` 声明文件

## 选择器

- **常用选择器**
- id 选择 #app
- class 选择 .app
- 标签选择 span
- 后代 div span
- 子代 div > span
- 邻接兄弟 span + div
- 通用兄弟 span ~ div
- **属性选择**
- 存在属性 span[attr] => a[title]
- 属性相等 span[attr=value] => a[href="https://example.com"]
- 包含(空格分开) [attr~=value] => li[class~="a"]
- 开头等于或则已 zh-开头 [attr|=value] => div[lang|="zh"]
- 开头包含 [attr^=value] => a[src^="https"]
- 结尾包含 [attr$=value] => a[src$=".vue"]
- 包含 [attr*=value] => a[src*="hello"]
- **伪类**
- :last-of-type 选择同级同元素的最后一个
- :last-child 选择父元素下最后一个元素
- :not(选择器) 匹配作为值传入自身的选择器未匹配的物件
- :nth-child(2n+1) -> span:nth-child(-n+3) 选择父级下面第几个元素
- :nth-of-type 选择父级下面同类型的第几个元素
- :nth-last-child
- :nth-last-of-type
- CSS 伪类首先找到所有当前元素的兄弟元素，然后按照位置先后顺序从 1 开始排序，选择的结果为 CSS 伪类\* :nth-child 括号中表达式（an+b）匹配到的元素集合（n=0，1，2，3...）
- :only-child 选择没有兄弟的元素
- :only-of-type 选择同级没有相同元素的元素
