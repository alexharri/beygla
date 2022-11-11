export interface TrieNode {
  path: string;
  value: string;
  children: Record<string, TrieNode>;
  keys: string[];
}

export interface SmallTrie {
  value: string;
  children: Record<string, SmallTrie>;
}
