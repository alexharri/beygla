import path from "path";
import fs from "fs";
import { createAndPopulateTrie } from "../src/compress/trie/createTrie";
import { serializeTrie } from "../src/compress/trie/serialize";
import { deserializeTrie } from "../src/read/deserialize";
import { gzipFile } from "../src/preprocess/utils/gzip";

const filePath = path.resolve(__dirname, "../out/grouped-names.json");
const outFile = path.resolve(__dirname, "../out/trie-full.json");
const serializedFile = path.resolve(__dirname, "../out/trie-ser.txt");
const deserializedJsonFile = path.resolve(__dirname, "../out/trie-deser.json");

async function main() {
  const names: string[][] = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const trie = createAndPopulateTrie(names);

  fs.writeFileSync(outFile, JSON.stringify(trie), "utf-8");

  const serialized = serializeTrie(trie.getTrie());
  fs.writeFileSync(serializedFile, serialized, "utf-8");
  fs.writeFileSync(
    deserializedJsonFile,
    JSON.stringify(deserializeTrie(serialized)),
    "utf-8"
  );

  gzipFile(outFile);
  gzipFile(serializedFile);
  gzipFile(deserializedJsonFile);
}

main();
