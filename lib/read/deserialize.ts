import { NO_DECLENSION, NO_DECLENSION_MARKER } from "../common/constants";
import { CompressedTrie } from "../common/types";

const isChar = (c: string) => c === "-" || c.toLowerCase() !== c.toUpperCase();
const validTerminator = (c: string) => ["!", "_"].indexOf(c) !== -1;

type Node = [node: CompressedTrie, done: boolean];

export function deserializeTrie(str: string): CompressedTrie {
  let i = 0;

  const char = () => str.substr(i, 1);
  const next = () => i++;

  function deserializeLeaf(): Node {
    function returnValue(c: string, value: string): Node {
      if (!validTerminator(c)) throw new Error("INV_TER: " + c);
      return [{ value, children: {} }, c === "!"];
    }

    const firstChar = char();

    if (firstChar === NO_DECLENSION_MARKER) {
      next(); // Move beyond terminator
      return returnValue(firstChar, NO_DECLENSION);
    }

    const parts: string[] = [];

    for (let i = 0; ; i++) {
      let part = "";
      let c = char();
      while (isChar(c)) {
        part += c;
        next();
        c = char();
      }

      // 'c' is terminator or separator
      parts.push(part);
      next(); // Move beyond terminator or separator

      if (i === 3) {
        return returnValue(c, parts.join(","));
      }

      // 'c' should be terminator
      if (c !== ",") throw new Error("INV_SEP: " + c);
    }
  }

  function deserializeKey(): string {
    let key = "";
    let c = char();
    while (isChar(c)) {
      key += c;
      next();
      c = char();
    }
    if (c !== ":") throw new Error("INV_COL: " + c);
    next(); // Move past ':' to value
    return key;
  }

  function deserializeObject(): Node {
    next(); // Move to first property

    const children: CompressedTrie["children"] = {};
    while (true) {
      const key = deserializeKey();
      const [child, done] = deserialize();
      children[key] = child;
      if (!done) continue;

      const c = char(); // Should be terminator
      next(); // Move past terminator

      if (!validTerminator(c)) throw new Error("INV_TER: " + c);
      return [{ value: "", children }, c === "!"];
    }
  }

  function deserialize(): Node {
    const c = char();
    if (c === "{") {
      return deserializeObject();
    }
    return deserializeLeaf();
  }

  return deserialize()[0];
}
