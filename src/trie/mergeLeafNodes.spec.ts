import { Trie } from "./Trie";

describe("mergeLeafNodes", () => {
  it("merges diverging leaf nodes with common endings", () => {
    const A = "a";
    const B = "b";
    const trie = new Trie()
      .insert("Silja", A)
      .insert("Bylgja", A)
      .insert("Marja", B);

    trie.simplify();

    expect(trie.leafAtKeyExists("(l|g)ja")).toEqual(true);
    expect(trie.leafAtKeyExists("rja")).toEqual(true);
  });

  it("is not sensitive to letter order when accessing merged leaf nodes", () => {
    const A = "a";
    const B = "b";
    const trie = new Trie()
      .insert("Silja", A)
      .insert("Bylgja", A)
      .insert("Marja", B);

    trie.simplify();

    expect(trie.leafAtKeyExists("(l|g)ja")).toEqual(true);
    expect(trie.leafAtKeyExists("(g|l)ja")).toEqual(true);
  });
});
