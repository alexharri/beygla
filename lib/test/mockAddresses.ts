jest.mock("../read/serializedInput", () => {
  const fs = require("fs");
  const path = require("path");

  const serializedTrieFilePath = path.resolve(
    __dirname,
    "../../out/addresses-trie-ser.txt"
  );
  const serializedTrie = fs.readFileSync(serializedTrieFilePath, "utf-8");

  return {
    __esModule: true,
    default: serializedTrie,
  };
});

jest.mock("../read/mode", () => ({ __esModule: true, default: "addresses" }));
