export interface TrieNode {
  path: string;
  value: string;
  children: Record<string, TrieNode>;
  keys: string[];
}

export interface CompressedTrie {
  value: string;
  children: Record<string, CompressedTrie>;
}
