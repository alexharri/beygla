import { Trie } from "../types/Trie";

export function simplifyTrie(root: Trie) {
  /** @returns common ending if there is one */
  function dfs(node: Trie): [ending: string, keys: string[]] {
    const children = Object.values(node.children);

    if (children.length === 0) {
      return [node.value, node.keys];
    }

    let commonEnding = "";
    const keys: string[] = [];

    const childResults = children.map((child) => dfs(child!));

    for (const [ending, childKeys] of childResults) {
      keys.push(...childKeys);

      if (!commonEnding) {
        commonEnding = ending;
        continue;
      }

      if (commonEnding !== ending) return ["", []];
    }

    if (commonEnding && keys.length === 0) {
      console.log(node.children);
      throw new Error(`Error at '${node.path}'`);
    }

    // There is a common ending
    node.value = commonEnding;
    node.keys = keys;
    node.children = {};

    return [commonEnding, keys];
  }

  dfs(root);
}
