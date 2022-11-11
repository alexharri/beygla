import { mergeCommonEndings } from "./mergeCommonEndings";
import { Trie } from "./Trie";

describe("mergeCommonEndings", () => {
  it("does not throw on an empty trie", () => {
    const trie = new Trie();
    expect(() => trie.mergeCommonEndings()).not.toThrow();
  });

  it("merges common endings", () => {
    const A = "a";
    const trie = new Trie().insert("Svala", A).insert("Vala", A);

    trie.mergeCommonEndings();

    const value = trie.get("ala");
    expect(value).toEqual(A);
  });

  it("merges endings as much as possible", () => {
    const V = "value";
    const trie = new Trie().insert("Bríanna", V).insert("Maríanna", V);

    trie.mergeCommonEndings();

    expect(trie.leafAtKeyExists("a")).toEqual(true);
    expect(trie.leafAtKeyExists("ríanna")).toEqual(false);
  });

  it("does not merge uncommon endings", () => {
    const A = "a";
    const B = "b";
    const trie = new Trie()
      .insert("Jóhanna", A)
      .insert("Geirfinna", A)
      .insert("Súsanna", B);

    trie.mergeCommonEndings();

    const value = trie.get("nna");
    expect(value).toEqual(null);
  });

  it("merges branches as soon as they have a common ending", () => {
    const A = "a";
    const B = "b";
    const trie = new Trie()
      .insert("Jóhanna", A)
      .insert("Súsanna", A)
      .insert("Geirfinna", B);

    trie.mergeCommonEndings();

    expect(trie.leafAtKeyExists("nna")).toEqual(false);

    // Jóhanna, Súsanna
    expect(trie.leafAtKeyExists("anna")).toEqual(true);

    // Geirfinna
    expect(trie.leafAtKeyExists("inna")).toEqual(true);
  });
});
