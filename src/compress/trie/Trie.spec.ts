import { Trie } from "./Trie";

describe("Trie", () => {
  it("inserts and retrieves a value", () => {
    const trie = new Trie().insert("Alex", "value");

    expect(trie.get("Alex")).toEqual("value");
  });

  it("returns null if the value does not exist", () => {
    const trie = new Trie();

    expect(trie.get("key")).toEqual(null);
  });
});
