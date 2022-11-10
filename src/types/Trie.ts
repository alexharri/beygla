export interface Trie {
  path: string;
  value: string;
  children: Record<string, Trie>;
  keys: string[];
}
