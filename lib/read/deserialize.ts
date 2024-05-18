import { NO_DECLENSION, NO_DECLENSION_MARKER } from "../common/constants";
import { CompressedTrie } from "../common/types";

const isChar = (c: string) => c === "-" || c.toLowerCase() !== c.toUpperCase();
const isNumeric = (c: string) => /^[0-9]$/.test(c);
const validTerminator = (c: string) => ["!", "_"].indexOf(c) !== -1;

type Node = [node: CompressedTrie, done: boolean];

export function deserializeTrie(str: string): CompressedTrie {
  let i = 0;

  const char = () => str.substr(i, 1);
  const next = () => i++;

  function deserializeLeaf(): Node {
    let subtraction = char();
    next(); // Move beyond number to ';' or '~'

    function returnValue(c: string, value: string): Node {
      if (!validTerminator(c)) throw new Error("INV_TER: " + c);
      return [{ value, children: {} }, c === "!"];
    }

    if (subtraction === NO_DECLENSION_MARKER) {
      const c = char();
      next(); // Move beyond terminator
      return returnValue(c, NO_DECLENSION);
    }

    // Subtraction may be composed of multiple numbers. Keep searching
    {
      let c: string;
      while (isNumeric((c = char()))) {
        subtraction += c;
        next();
      }
    }

    next(); // Move to first part

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
        return returnValue(c, `${subtraction};${parts.join(",")}`);
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
    if (c === NO_DECLENSION_MARKER || isNumeric(c)) {
      return deserializeLeaf();
    }
    if (c === "{") {
      return deserializeObject();
    }
    throw new Error("INV_CHAR: " + c);
  }

  return deserialize()[0];
}
