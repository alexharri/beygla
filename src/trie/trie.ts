import { formatEnding } from "../declension/formatEnding";
import { Trie } from "../types/Trie";
import { simplifyTrie } from "./simplifyTrie";

function insertIntoTrie(names: string[], trie: Trie) {
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
    node = node.children[char]!;
  }
  node.value = formatEnding(names);
  node.keys.push(nf);
}

export function createTrie(namesArr: string[][]) {
  const trie: Trie = {
    path: "",
    children: {},
    value: "",
    keys: [],
  };

  for (const names of namesArr) {
    insertIntoTrie(names, trie);
  }

  simplifyTrie(trie);

  return trie;
}
