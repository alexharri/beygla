import { SmallTrie, Trie } from "../types/Trie";

const emptyNode: SmallTrie = { children: {}, value: "" };

export function serializeTrie(trie: Trie): string {
  function serializeKey(key: string) {
    return key.split("|").join("");
  }

  function serializeLeaf(node: Trie, last: boolean): string {
    const terminator = last ? "!" : "-";
    return node.value + terminator;
  }

  function serialize(node: Trie, last: boolean): string {
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

export function deserializeTrie(str: string): SmallTrie {
  let i = 0;

  const char = () => str.substr(i, 1);
  const next = () => i++;

  function deserializeLeaf(): [node: SmallTrie, done: boolean] {
    const num = char();
    next(); // Move to ','
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
        const node = { children: {}, value: `${num};${parts.join(",")}` };
        if (c === "!") return [node, true];
        if (c === "-") return [node, false];
        throw new Error(`Unexpected terminator '${c}'`);
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

  function deserializeObject(): [node: SmallTrie, done: boolean] {
    next(); // Move to first property

    const warnAndReturn = <T>(v: T) => {
      console.warn(`Unexpected immediately closing object.`);
      next();
      return v;
    };

    if (i === 878) console.log({ c: char() });

    // Immediately self-closing object, should not happen
    if (char() === "-") return warnAndReturn([emptyNode, false]);
    if (char() === "!") return warnAndReturn([emptyNode, false]);

    const children: SmallTrie["children"] = {};
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

  function deserialize(): [node: SmallTrie, done: boolean] {
    if (isNumeric(char())) {
      return deserializeLeaf();
    }
    if (char() === "{") {
      return deserializeObject();
    }
    throw new Error(`Unexpected char '${char()}'`);
  }

  const [trie] = deserialize();
  return trie;
}
