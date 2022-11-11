import { formatEnding } from "../declension/formatEnding";
import { ITrie } from "../types/Trie";
import { mergeCommonEndings } from "./mergeCommonEndings";
import { mergeLeafNodes } from "./mergeLeafNodes";

function insertIntoTrie(names: string[], trie: ITrie) {
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
  node.value = formatEnding(names);
  node.keys.push(nf);
}

export function createTrie(namesArr: string[][]) {
  const trie: ITrie = {
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
