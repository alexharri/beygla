export interface CompressedTrie {
  value: string;
  children: Record<string, CompressedTrie>;
}
