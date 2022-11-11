import fs from "fs";
import path from "path";
import { CompressedTrie, TrieNode } from "../src/compress/trie/trieTypes";

function serializeSankeyFull() {
  const trie: TrieNode = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "../out/trie.json"), "utf-8")
  );

  let out = "";

  const map = new Map<TrieNode, number>();

  function count(node: TrieNode): number {
    if (map.has(node)) return map.get(node)!;

    let sum = 0;

    for (const child of Object.values(node.children)) {
      sum += count(child);
    }

    sum += node.keys.length;

    map.set(node, sum);
    return sum;
  }

  function dfs(node: TrieNode) {
    for (const child of Object.values(node.children)) {
      dfs(child);
      if (node.path) {
        out += `${node.path} [${count(child)}] ${child.path} ${
          child.keys.length ? `(${child.keys.join(", ")})` : ""
        } ${child.value ? `[${child.value}]` : ""}\n`;
      }
    }
  }

  dfs(trie.children.a);

  return out;
}

function serializeSankeyMinimal() {
  const trie: CompressedTrie = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "../out/trie-deser.json"), "utf-8")
  );

  let out = "";

  const map = new Map<CompressedTrie, number>();

  function count(node: CompressedTrie): number {
    if (map.has(node)) return map.get(node)!;

    let sum = 0;

    for (const child of Object.values(node.children)) {
      sum += count(child);
    }

    if (!sum) sum++;

    map.set(node, sum);
    return sum;
  }

  function dfs(node: CompressedTrie, path: string) {
    for (const [key, child] of Object.entries(node.children)) {
      const currPath = [
        key.length > 1 ? `(${key.split("").join("|")})` : key,
        path,
      ].join("");

      dfs(child, currPath);

      out += `${path} [${count(child)}] ${currPath} ${
        child.value ? `[${child.value}]` : ""
      }\n`;
    }
  }

  dfs(trie.children.a, "a");

  return out;
}

fs.writeFileSync(
  path.resolve(__dirname, "../out/sankey-full.txt"),
  serializeSankeyFull(),
  "utf-8"
);

fs.writeFileSync(
  path.resolve(__dirname, "../out/sankey-deserialized.txt"),
  serializeSankeyMinimal(),
  "utf-8"
);
