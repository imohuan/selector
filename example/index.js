const { getSelector } = require("im-selector");
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
const parser = getSelector(html, {
  name: "im-selector",
  age: 100
});
console.log(parser.query({ cls: ".head::text", rules: ["trim"] }));
console.log(parser.query({ cls: ".what::text|.dddd::text|.head::text", rules: ["trim"] }));
