import { CompressedTrie } from "../common/types";

export function extractDeclension(
  trie: CompressedTrie,
  name: string
): string | null {
  let node = trie;

  for (const char of name.split("").reverse()) {
    const next = node.children[char];

    if (next) {
      if (next.value) {
        // We've reached a leaf node, return the value
        return next.value;
      }

      // Non-leaf node. Keep traversing the trie
      node = next;
      continue;
    }

    // If there is no next node for the current character, and the
    // current node is not a leaf node, we are either:
    //
    //    1. at a dead end
    //    2. the next node is a "union leaf node"
    //
    // If 'node.children' looks like so:
    //
    //    {
    //      abc: { ... },
    //      d: { ... },
    //    }
    //
    // Then 'abc' is an example of a union leaf node. If 'char' is
    // one of the characters that comprises the key, then the union
    // leaf node contains the value we're looking for.
    //
    for (const key of Object.keys(node.children)) {
      for (let i = 0; i < key.length; i++) {
        if (key.substr(i, 1) === char) {
          return node.children[key].value;
        }
      }
    }

    // We are at a dead end.
    break;
  }

  return null;
}
