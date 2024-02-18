interface TrieNode {
  end: boolean;
  children: Record<string, TrieNode>;
}

const isChars = "áðéíóúþæö";

function emptyNode(): TrieNode {
  return { children: {}, end: false };
}

export function encodeNames(names: Set<string>): string {
  const root: TrieNode = emptyNode();

  function add(name: string) {
    let curr = root;
    const chars = name.split("").map((s) => s.toLowerCase());
    for (const char of chars) {
      if (!curr.children[char]) {
        curr.children[char] = emptyNode();
      }
      curr = curr.children[char];
    }
    curr.end = true;
  }

  for (const name of names) add(name);

  const chars: string[] = [];
  function iter(char: string, curr: TrieNode) {
    const isCharIndex = isChars.indexOf(char);
    if (isCharIndex !== -1) {
      chars.push("'"); // Denotes an Icelandic character
      char = String(isCharIndex);
    }
    chars.push(char);
    if (curr.end) chars.push(".");

    const children = Object.entries(curr.children);
    for (const [key, value] of children) {
      iter(key, value);
    }
    chars.push("<");
  }

  for (const [key, next] of Object.entries(root.children)) {
    iter(key, next);
  }

  return chars.join("");
}
