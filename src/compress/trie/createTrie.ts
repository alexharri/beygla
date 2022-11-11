import { formatDeclension } from "../declension";
import { TrieNode } from "./trieTypes";
import { mergeCommonEndings } from "./mergeCommonEndings";
import { mergeLeafNodes } from "./mergeLeafNodes";

function insertIntoTrie(names: string[], trie: TrieNode) {
  const nf = names[0];

  let node = trie;
  let soFar = "";

  for (const char of nf.split("").reverse()) {
    soFar = char + soFar;
    if (!node.children[char]) {
      node.children[char] = {
        path: soFar,
        children: {},
        value: "",
        keys: [],
      };
    }
    node = node.children[char];
  }
  node.value = formatDeclension(names);
  node.keys.push(nf);
}

export function createTrie(namesArr: string[][]) {
  const trie: TrieNode = {
    path: "",
    children: {},
    value: "",
    keys: [],
  };

  for (const names of namesArr) {
    insertIntoTrie(names, trie);
  }

  mergeCommonEndings(trie);
  mergeLeafNodes(trie);

  return trie;
}
