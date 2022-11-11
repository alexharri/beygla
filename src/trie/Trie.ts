import { formatEnding } from "../declension/formatEnding";
import { TrieNode } from "../types/Trie";
import { mergeCommonEndings } from "./mergeCommonEndings";
import { mergeLeafNodes } from "./mergeLeafNodes";

function emptyNodeAtPath(path: string): TrieNode {
  return { path, children: {}, value: "", keys: [] };
}

export class Trie {
  private trie: TrieNode = {
    path: "",
    value: "",
    children: {},
    keys: [],
  };

  get(key: string): string | null {
    const accessors = this.splitKeyIntoAccessors(key);
    let node = this.trie;
    for (const accessor of accessors) {
      const next = node.children[accessor];
      if (!next) break;
      node = next;
    }
    return node.value || null;
  }

  leafAtKeyExists(key: string): boolean {
    const accessors = this.splitKeyIntoAccessors(key);
    let node = this.trie;
    for (const accessor of accessors) {
      const next = node.children[accessor];
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

  splitKeyIntoAccessors(key: string): string[] {
    const parts = [];
    for (let i = 0; i < key.length; i++) {
      if (key.substr(i, 1) !== "(") {
        parts.push(key.substr(i, 1));
        continue;
      }
      let j = 4; // at least "(a|b)"
      while (i + j < key.length && key.substr(i + j, 1) !== ")") {
        j++;
      }
      const insideParens = key
        .substr(i + 1, i + j - 1)
        .split("|")
        .sort()
        .join("|");
      parts.push(insideParens);
      i = i + j;
    }
    return parts.reverse();
  }
}
