import { NO_DECLENSION, NO_DECLENSION_MARKER } from "../common/constants";
import { CompressedTrie } from "../common/types";

const isChar = (c: string) => c.toLowerCase() !== c.toUpperCase();
const isNumeric = (c: string) => /^[0-9]$/.test(c);
const validTerminator = (c: string) => ["!", "-"].indexOf(c) !== -1;

export function deserializeTrie(str: string): CompressedTrie {
  let i = 0;

  const char = () => str.substr(i, 1);
  const next = () => i++;

  function deserializeLeaf(): [node: CompressedTrie, done: boolean] {
    // Currently we check that the maximum subtraction (num) is 9, so we
    // can read one digit and continue.
    //
    // This check occurs in 'declension.ts'.
    const subtraction = char();
    next(); // Move beyond number to ';' or '~'

    const returnValue = (
      c: string,
      value: string
    ): [node: CompressedTrie, done: boolean] => {
      if (!validTerminator(c)) throw new Error("INV_TER: " + c);
      return [{ value, children: {} }, c === "!"];
    };

    if (subtraction === NO_DECLENSION_MARKER) {
      const c = char();
      next(); // Move beyond terminator
      return returnValue(c, NO_DECLENSION);
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

  function deserializeObject(): [node: CompressedTrie, done: boolean] {
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

  function deserialize(): [node: CompressedTrie, done: boolean] {
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
