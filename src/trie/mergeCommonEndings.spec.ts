import { Trie } from "../types/Trie";
import { mergeCommonEndings } from "./mergeCommonEndings";

describe("mergeCommonEndings", () => {
  it("does not throw", () => {
    const basicTrie: Trie = {
      path: "",
      value: "",
      children: {},
      keys: [],
    };
    expect(() => mergeCommonEndings(basicTrie)).not.toThrow();
  });
});
