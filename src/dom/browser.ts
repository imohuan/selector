import { isString } from "lodash-es";

import { Parser, ParserArray } from "../typings";

export class BrowserParser implements Parser {
  root: HTMLElement;
  current: HTMLElement;

  constructor(root: string | HTMLElement, current: Element | HTMLElement | null = null) {
    if (isString(root)) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(root, "text/html");
      this.root = doc.documentElement;
    } else {
      this.root = root;
    }
    this.current = current ? (current as HTMLElement) : this.root;
  }

  attr(prop: string): string | null {
    return this.current.getAttribute(prop);
  }

  html(): string | null {
    return this.current.innerHTML;
  }

  text(): string | null {
    return this.current.innerText;
  }

  first(): BrowserParser | null {
    const result = this.current.firstElementChild;
    if (!result) return null;
    return new BrowserParser(this.root, result);
  }

  last(): BrowserParser | null {
    const result = this.current.lastElementChild;
    if (!result) return null;
    return new BrowserParser(this.root, result);
  }

  queryRoot(): BrowserParser {
    return new BrowserParser(this.root);
  }

  querySelector(selector: string): BrowserParser | null {
    const result = this.current.querySelector(selector);
    if (!result) return null;
    return new BrowserParser(this.root, result);
  }

  querySelectorAll(selector: string): BrowserParserArray {
    const result = Array.from(this.current.querySelectorAll(selector));
    return new BrowserParserArray(this.root, result);
  }
}

export class BrowserParserArray implements ParserArray {
  root: HTMLElement;
  current: BrowserParser[];

  constructor(root: HTMLElement, current: HTMLElement[] | Element[]) {
    this.root = root;
    this.current = current.map((item) => new BrowserParser(this.root, item));
  }

  first() {
    if (this.current.length === 0) return null;
    return this.current[0];
  }

  last() {
    if (this.current.length === 0) return null;
    return this.current[this.current.length - 1];
  }

  each(callback: (value: BrowserParser, index: number, all: BrowserParser[]) => void) {
    this.current.forEach((value, index) => {
      callback(value, index, this.current);
    });
  }

  queryRoot(): BrowserParser {
    return new BrowserParser(this.root);
  }
}

export default BrowserParser;
