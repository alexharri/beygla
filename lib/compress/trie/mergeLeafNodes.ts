import { TrieNode } from "./trieTypes";

export function mergeLeafNodes(root: TrieNode) {
  function dfs(node: TrieNode) {
    for (const child of Object.values(node.children)) {
      dfs(child);
    }

    const keys = Object.keys(node.children);

    const keysByValue: Record<string, { keys: string[]; names: string[] }> = {};
    const nonLeafKeys = new Set<string>();

    for (const key of keys) {
      const child = node.children[key];
      if (!child.value) {
        nonLeafKeys.add(key);
        continue;
      }

      if (!keysByValue[child.value]) {
        keysByValue[child.value] = { keys: [], names: [] };
      }
      keysByValue[child.value].keys.push(key);
      keysByValue[child.value].names.push(...child.keys);
    }

    const out: TrieNode["children"] = {};

    for (const key of nonLeafKeys) {
      out[key] = node.children[key];
    }
    for (const [value, { keys, names }] of Object.entries(keysByValue)) {
      if (keys.length > 1) keys.sort(); // Make keys deterministic, easier to test.

      out[keys.join("")] = {
        path:
          keys.length === 1
            ? keys[0] + node.path
            : `(${keys.join("|")})` + node.path,
        children: {},
        keys: names,
        value,
      };
    }

    node.children = out;
  }

  dfs(root);
}
