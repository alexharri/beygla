import "../test/mock";

import { getNames } from "../preprocess/data/getNames";
import { encodeNames } from "./encode";
import { decodeNames } from "../strict";

const firstUpper = (s: string) => s[0].toUpperCase() + s.substr(1);

interface TrieNode {
  e: number; // end
  c: Record<string, TrieNode>; // children
}

function decodedTrieToSet(trie: TrieNode) {
  const set = new Set<string>();

  function iter(node: TrieNode, stack: string[]) {
    if (node.e) set.add(firstUpper(stack.join("")));
    const entries = Object.entries(node.c) as [string, TrieNode][];
    for (const [char, next] of entries) {
      stack.push(char);
      iter(next, stack);
      stack.pop();
    }
  }
  iter(trie, []);

  return set;
}

describe("encode and decode names", () => {
  it("it correctly encodes and decodes the set of Icelandic names", () => {
    const names = getNames();

    const expectedNameSet = new Set(names);

    const encoded = encodeNames(expectedNameSet);
    const decodedAsTrie = decodeNames(encoded);
    const decodedNameSet = decodedTrieToSet(decodedAsTrie);

    expect(decodedNameSet).toEqual(expectedNameSet);
  });
});
