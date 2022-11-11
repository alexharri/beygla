export interface Trie {
  path: string;
  value: string;
  children: Record<string, Trie>;
  keys: string[];
}

export interface SmallTrie {
  value: string;
  children: Record<string, SmallTrie>;
}
