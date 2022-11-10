export interface Trie {
  path: string;
  value: string;
  children: Partial<Record<string, Trie>>;
  keys: string[];
}
