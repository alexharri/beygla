import { setPredicate } from "./beygla";
import serializedNames from "./read/serializedNames";

interface TrieNode {
  e: number; // end
  c: Record<string, TrieNode>; // children
}

export function decodeNames(data: string): TrieNode {
  const stack: TrieNode[] = [{ e: 0, c: {} }];

  for (let i = 0; i < data.length; i++) {
    let char = data[i];
    let node = stack[stack.length - 1];
    if (char === ".") {
      node.e = 1;
    } else if (char === "<") {
      stack.pop();
    } else {
      stack.push((node.c[char] ||= { e: 0, c: {} }));
    }
  }

  return stack[0];
}

const trie = decodeNames(serializedNames);

function predicate(name: string): boolean {
  name = name.toLowerCase();
  let curr = trie;
  for (let i = 0; curr && i < name.length; i++) {
    curr = curr.c[name[i]];
  }
  return !!(curr && curr.e);
}
setPredicate(predicate);

export * from "./beygla";
