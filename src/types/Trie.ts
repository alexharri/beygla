export interface Trie {
  soFar: string;
  children: Partial<Record<string, Trie>>;
  ending: string;
}
