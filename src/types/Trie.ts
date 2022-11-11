export interface ITrie {
  path: string;
  value: string;
  children: Record<string, ITrie>;
  keys: string[];
}

export interface SmallTrie {
  value: string;
  children: Record<string, SmallTrie>;
}
