import { Trie } from "../compress/trie/Trie";
import { extractDeclension } from "./extractDeclension";

describe("extractDeclension", () => {
  it("returns null when given an empty trie", () => {
    const trie = new Trie().getTrie();

    expect(extractDeclension(trie, "Jóhanna")).toEqual(null);
  });

  it("returns the declension for a name that was inserted when simplified", () => {
    const trie = new Trie()
      .insert("Jóhanna", "a")
      .insert("Súsanna", "a")
      .simplify()
      .getTrie();

    const result = extractDeclension(trie, "Jóhanna");

    expect(result).toEqual("a");
  });

  it("returns the declension for a common ending", () => {
    const trie = new Trie()
      .insert("Jóhanna", "a")
      .insert("Súsanna", "a")
      .simplify()
      .getTrie();

    // Common endingi of 'anna'
    const result = extractDeclension(trie, "Bríanna");

    expect(result).toEqual("a");
  });

  it("returns the declension from union leaf nodes", () => {
    const A = "a";
    const B = "b";
    const trie = new Trie()
      .insert("Silja", A)
      .insert("Bylgja", A)
      .insert("Marja", B)
      .simplify();

    const result = extractDeclension(trie.getTrie(), "Bylgja");

    expect(result).toEqual(A);
    // Demonstrate that the node at 'gja' is a union leaf node
    expect(trie.leafAtKeyExists("(l|g)ja")).toEqual(true);
  });

  it("returns null if an ending for the name is not found", () => {
    const A = "a";
    const B = "b";
    const trie = new Trie()
      .insert("Silja", A)
      .insert("Bylgja", A)
      .insert("Marja", B)
      .simplify();

    // A and B diverge at the third character, so Brynja (with a third
    // character of 'n') should does not share and ending.
    //
    //    (l|g)ja -> A
    //        rja -> B
    //        *ja -> null
    //
    const result = extractDeclension(trie.getTrie(), "Brynja");

    expect(result).toEqual(null);
  });
});
