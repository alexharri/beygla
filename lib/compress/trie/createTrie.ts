import { formatDeclension } from "../declension";
import { Trie } from "./Trie";

export function createAndPopulateTrie(namesArr: string[][]) {
  const trie = new Trie();

  for (const names of namesArr) {
    const declension = formatDeclension(names);
    trie.insert(names[0], declension);
  }

  trie.simplify();

  return trie;
}
