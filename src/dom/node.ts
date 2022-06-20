import { Cheerio, CheerioAPI, Element, load } from "cheerio";
import { isString } from "lodash-es";

import { Parser, ParserArray } from "../typings";

export class NodeParser implements Parser {
  root: CheerioAPI;
  current: Cheerio<Element>;

  constructor(root: string | CheerioAPI, current: Cheerio<Element> | null = null) {
    this.root = isString(root) ? load(root) : root;
    this.current = current ? current : this.root("html");
  }

  attr(prop: string): string | null {
    const result = this.current.attr(prop);
    if (!result) return null;
    return result;
  }

  html(): string | null {
    return this.current.html();
  }

  text(): string | null {
    return this.current.text();
  }

  first(): NodeParser | null {
    const result = this.current.children().first();
    return new NodeParser(this.root, result);
  }

  last(): NodeParser | null {
    const result = this.current.children().last();
    return new NodeParser(this.root, result);
  }

  queryRoot(): NodeParser {
    return new NodeParser(this.root, this.root("html"));
  }

  querySelector(selector: string): NodeParser | null {
    const result = this.current.find(selector).first();
    return new NodeParser(this.root, result);
  }

  querySelectorAll(selector: string): NodeParserArray {
    const result = this.current.find(selector);
    return new NodeParserArray(this.root, result);
  }
}

export class NodeParserArray implements ParserArray {
  root: CheerioAPI;
  current: NodeParser[];

  constructor(root: CheerioAPI, current: Cheerio<Element>) {
    this.root = root;
    this.current = Array.from(current).map((item) => new NodeParser(this.root, root(item)));
  }

  queryRoot(): NodeParser {
    return new NodeParser(this.root, this.root("html"));
  }

  first(): Parser | null {
    return this.current[0];
  }

  last(): Parser | null {
    return this.current[this.current.length - 1];
  }

  each(callback: (value: Parser, index: number, all: Parser[]) => void): void {
    this.current.forEach((item, index) => {
      callback(item, index, this.current);
    });
  }
}

export default NodeParser;
