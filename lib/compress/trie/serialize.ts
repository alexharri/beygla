import { TrieNode } from "./Trie";

const TER_LAST = "!";
const TER = "_";

export function serializeTrie(trie: TrieNode): string {
  function serializeLeaf(node: TrieNode, last: boolean): string {
    const terminator = last ? TER_LAST : TER;
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

    const terminator = last ? TER_LAST : TER;
    out += terminator;

    return out;
  }

  return serialize(trie, true);
}
