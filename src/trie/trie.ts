import { formatEnding } from "../declension/formatEnding";
import { ITrie } from "../types/Trie";
import { mergeCommonEndings } from "./mergeCommonEndings";
import { mergeLeafNodes } from "./mergeLeafNodes";

function emptyNodeAtPath(path: string): ITrie {
  return { path, children: {}, value: "", keys: [] };
}

export class Trie {
  private trie: ITrie = {
    path: "",
    value: "",
    children: {},
    keys: [],
  };

  get(key: string): string | null {
    let node = this.trie;
    for (const char of key.split("").reverse()) {
      const next = node.children[char];
      if (!next) break;
      node = next;
    }
    return node.value || null;
  }

  leafAtKeyExists(key: string): boolean {
    let node = this.trie;
    for (const char of key.split("").reverse()) {
      const next = node.children[char];
      if (!next) return false;
      node = next;
    }
    return !!node.value;
  }

  insert(key: string, value: string) {
    let node = this.trie;
    let path = "";

    for (const char of key.split("").reverse()) {
      path = char + path;
      if (!node.children[char]) {
        node.children[char] = emptyNodeAtPath(path);
      }
      node = node.children[char]!;
    }

    node.value = value;
    node.keys.push(key);
    return this;
  }

  insertName(nameCases: string[]) {
    this.insert(nameCases[0], formatEnding(nameCases));
    return this;
  }

  getTrie() {
    return this.trie;
  }

  simplify() {
    this.mergeCommonEndings();
    this.mergeLeafNodes();
    return this;
  }

  mergeCommonEndings() {
    mergeCommonEndings(this.trie);
    return this;
  }

  mergeLeafNodes() {
    mergeLeafNodes(this.trie);
    return this;
  }
}
