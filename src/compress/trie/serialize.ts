import { NO_DECLENSION, NO_DECLENSION_MARKER } from "../../constants";
import { CompressedTrie, TrieNode } from "./trieTypes";

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
