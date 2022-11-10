import { Trie } from "../types/Trie";
import { simplifyTrie } from "./simplifyTrie";

describe("simplifyTrie", () => {
  it("does not throw", () => {
    const basicTrie: Trie = {
      path: "",
      value: "",
      children: {},
      keys: [],
    };
    expect(() => simplifyTrie(basicTrie)).not.toThrow();
  });
});
