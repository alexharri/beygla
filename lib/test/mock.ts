jest.mock("../read/serializedInput", () => {
  const fs = require("fs");
  const path = require("path");

  const serializedTrieFilePath = path.resolve(
    __dirname,
    "../../out/trie-ser.txt"
  );
  const serializedTrie = fs.readFileSync(serializedTrieFilePath, "utf-8");

  return {
    __esModule: true,
    default: serializedTrie,
  };
});

jest.mock("../read/mode", () => ({ __esModule: true, default: "names" }));

jest.mock("../read/serializedNames", () => {
  const fs = require("fs");
  const path = require("path");

  const serializedNamesFilePath = path.resolve(
    __dirname,
    "../../out/names-ser.txt"
  );
  const serializedNames = fs.readFileSync(serializedNamesFilePath, "utf-8");

  return {
    __esModule: true,
    default: serializedNames,
  };
});
