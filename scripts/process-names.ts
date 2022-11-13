import path from "path";
import fs from "fs";
import { createAndPopulateTrie } from "../lib/compress/trie/createTrie";
import { serializeTrie } from "../lib/compress/trie/serialize";
import { deserializeTrie } from "../lib/read/deserialize";
import { writeAndLogSize } from "../lib/preprocess/utils/gzip";

const filePath = path.resolve(__dirname, "../out/grouped-names.json");
const outFile = path.resolve(__dirname, "../out/trie-full.json");
const serializedFile = path.resolve(__dirname, "../out/trie-ser.txt");
const deserializedJsonFile = path.resolve(__dirname, "../out/trie-deser.json");

async function main() {
  const names: string[][] = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const trie = createAndPopulateTrie(names);

  writeAndLogSize(outFile, JSON.stringify(trie));

  const serialized = serializeTrie(trie.getTrie());
  writeAndLogSize(serializedFile, serialized);
  writeAndLogSize(
    deserializedJsonFile,
    JSON.stringify(deserializeTrie(serialized))
  );
}

main();
