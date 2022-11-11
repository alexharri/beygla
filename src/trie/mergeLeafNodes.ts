import { ITrie } from "../types/Trie";

export function mergeLeafNodes(root: ITrie) {
  function dfs(node: ITrie) {
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

    const out: ITrie["children"] = {};

    for (const key of nonLeafKeys) {
      out[key] = node.children[key];
    }
    for (const [value, { keys, names }] of Object.entries(keysByValue)) {
      out[keys.join("|")] = {
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
