import fs from "fs";
import path from "path";
import { Trie } from "../src/types/Trie";

const trie: Trie = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../out/trie.json"), "utf-8")
);

let out = "";

const map = new Map<Trie, number>();

function count(node: Trie): number {
  if (map.has(node)) return map.get(node)!;

  let sum = 0;

  for (const child of Object.values(node.children)) {
    sum += count(child);
  }

  sum += node.keys.length;

  map.set(node, sum);
  return sum;
}

function dfs(node: Trie) {
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

fs.writeFileSync(path.resolve(__dirname, "../out/sankey.txt"), out, "utf-8");
