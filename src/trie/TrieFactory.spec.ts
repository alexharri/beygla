import { TrieFactory } from "./TrieFactory";

describe("TrieFactory", () => {
  it("returns the value if it exists", () => {
    const trie = new TrieFactory().insert("abc", "val");

    expect(trie.get("abc")).toEqual("val");
  });

  it("returns null if the value does not exist", () => {
    const trie = new TrieFactory();

    expect(trie.get("key")).toEqual(null);
  });
});
