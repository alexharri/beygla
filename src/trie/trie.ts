import { formatEnding } from "../declension/formatEnding";
import { Trie } from "../types/Trie";

function insertIntoTrie(names: string[], trie: Trie) {
  const nf = names[0];

  let node = trie;
  let soFar = "";

  for (const char of nf.split("").reverse()) {
    soFar = char + soFar;
    if (!node.children[char]) {
      node.children[char] = {
        soFar,
        children: {},
        ending: "",
      };
    }
    node = node.children[char]!;
  }
  node.ending = formatEnding(names);
}

export function createTrie(namesArr: string[][]) {
  const trie: Trie = {
    soFar: "",
    children: {},
    ending: "",
  };

  for (const names of namesArr) {
    insertIntoTrie(names, trie);
  }

  simplify(trie);

  return trie;
}

function simplify(root: Trie) {
  /** @returns common ending if there is one */
  function dfs(node: Trie): string {
    const children = Object.values(node.children);

    if (children.length === 0) {
      return node.ending;
    }

    let commonEnding = "";

    const endings = children.map((child) => dfs(child!));

    for (const ending of endings) {
      if (!commonEnding) {
        commonEnding = ending;
        continue;
      }

      if (commonEnding !== ending) return "";
    }

    // There is a common ending
    node.ending = commonEnding;
    node.children = {};

    return commonEnding;
  }

  dfs(root);
}
