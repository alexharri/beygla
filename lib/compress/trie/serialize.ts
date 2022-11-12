import { TrieNode } from "./Trie";

export function serializeTrie(trie: TrieNode): string {
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
        return `${key}:${serialize(child, last)}`;
      })
      .join("");

    const terminator = last ? "!" : "-";
    out += terminator;

    return out;
  }

  return serialize(trie, true);
}
