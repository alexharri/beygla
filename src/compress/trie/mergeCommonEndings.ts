import { TrieNode } from "./trieTypes";

export function mergeCommonEndings(root: TrieNode) {
  function dfs(node: TrieNode): [ending: string, keys: string[]] {
    const children = Object.values(node.children);

    if (children.length === 0) {
      return [node.value, node.keys];
    }

    let commonEnding = "";
    const keys: string[] = [];

    const childResults = children.map(dfs);

    for (const [ending, childKeys] of childResults) {
      keys.push(...childKeys);

      if (!ending) return ["", []];

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

  // Do not potentially merge the root.
  //
  // The root is not merged on the real dataset, but it makes
  // testing harder.
  for (const child of Object.values(root.children)) {
    dfs(child);
  }
}
