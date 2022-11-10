import { formatEnding } from "../declension/formatEnding";
import { Trie } from "../types/Trie";

function emptyNodeAtPath(path: string): Trie {
  return { path, children: {}, value: "", keys: [] };
}

export class TrieFactory {
  private trie: Trie = {
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
    return this;
  }

  insertName(nameCases: string[]) {
    this.insert(nameCases[0], formatEnding(nameCases));
    return this;
  }

  getTrie() {
    return this.trie;
  }
}
