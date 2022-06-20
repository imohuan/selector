import mitt from "mitt";
import { EmitterEvent, QueryChar, QueryReplace } from "../typings";
export const returnDefault = null;

export const defaultReplaces: QueryReplace[] = [
  [
    /:eq\(([0-9n\-+]+)\)/g,
    (_value: any, numStr: string) => {
      if (numStr.indexOf("n") !== -1) return `:nth-of-type(${numStr})`;
      const num = parseInt(numStr);
      if (num < 0) return `:nth-last-of-type(${Math.abs(num)})`;
      return `:nth-of-type(${num})`;
    },
    "eq 转换为 nth-of-type"
  ],
  [
    /:ed\(([0-9n\-+]+)\)/g,
    (_value: any, numStr: string) => {
      if (numStr.indexOf("n") !== -1) return `:nth-child(${numStr})`;
      const num = parseInt(numStr);
      if (num < 0) return `:nth-last-child(${Math.abs(num)})`;
      return `:nth-child(${num})`;
    },
    "ed 转换为 nth-child"
  ]
];

export const defaultChar: QueryChar = {
  all: "@",
  root: "!",
  current: "_",
  var: /\{([_a-zA-Z0-9]+)}/g,
  no: "*"
};

export const emitter = mitt<EmitterEvent>();
