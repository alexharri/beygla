import { NO_DECLENSION, NO_DECLENSION_MARKER } from "../declension";
import { CompressedTrie, TrieNode } from "./trieTypes";

const emptyNode: CompressedTrie = { children: {}, value: "" };

export function serializeTrie(trie: TrieNode): string {
  function serializeKey(key: string) {
    return key.split("|").join("");
  }

  function serializeLeaf(node: TrieNode, last: boolean): string {
    const terminator = last ? "!" : "-";
    return node.value + terminator;
  }

  function serialize(node: TrieNode, last: boolean): string {
    let out = "";

    if (node.value) {
      return serializeLeaf(node, last);
    }

    out += "{";

    out += Object.entries(node.children)
      .map(([key, child], i, arr) => {
        const last = i === arr.length - 1;
        return `${serializeKey(key)}:${serialize(child, last)}`;
      })
      .join("");

    const terminator = last ? "!" : "-";
    out += terminator;

    return out;
  }

  return serialize(trie, true);
}

const charSet = new Set("aábcdðeéfghiíjklmnoópqrstuúvwxyýzþæö".split(""));

function isChar(c: string) {
  return charSet.has(c.toLocaleLowerCase());
}

function isNumeric(c: string) {
  return /^[0-9]$/.test(c);
}

export function deserializeTrie(str: string): CompressedTrie {
  let i = 0;

  const char = () => str.substr(i, 1);
  const next = () => i++;

  function deserializeLeaf(): [node: CompressedTrie, done: boolean] {
    const num = char();
    next(); // Move to ';' or '~'

    /** @todo refactor to reuse common logic */

    function returnValue(
      c: string,
      value: string
    ): [node: CompressedTrie, done: boolean] {
      const node: CompressedTrie = { value, children: {} };
      if (c === "!") return [node, true];
      if (c === "-") return [node, false];
      throw new Error(`Unexpected terminator '${c}'`);
    }

    if (num === NO_DECLENSION_MARKER) {
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
      // 'c' should be terminator
      parts.push(part);
      next(); // Move beyond terminator
      if (i === 3) {
        return returnValue(c, `${num};${parts.join(",")}`);
      }
      if (c !== ",") throw new Error(`Expected ',', got '${c}'`);
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
    if (c !== ":") throw new Error(`Expected ':', got '${c}' at '${i}'`);
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

      const c = char();
      next(); // Move past terminator
      const node = { value: "", children };
      if (c === "!") return [node, true];
      if (c === "-") return [node, false];
      throw new Error(`Unexpected terminator '${c}'`);
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
    throw new Error(`Unexpected char '${c}'`);
  }

  const [trie] = deserialize();
  return trie;
}
