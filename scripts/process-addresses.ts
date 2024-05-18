import path from "path";
import fs from "fs";
import { createAndPopulateTrie } from "../lib/compress/trie/createTrie";
import { serializeTrie } from "../lib/compress/trie/serialize";
import { deserializeTrie } from "../lib/read/deserialize";
import { writeAndLogSize } from "../lib/preprocess/utils/gzip";
import { encodeNames } from "../lib/names/encode";
import { getAddresses } from "../lib/preprocess/data/getNames";

const filePath = path.resolve(
  __dirname,
  "../out/grouped-addresses-split-dash.json"
);
const outFile = path.resolve(__dirname, "../out/addresses-trie-full.json");
const serializedTrieFileName = path.resolve(
  __dirname,
  "../out/addresses-trie-ser.txt"
);
const serializedAddressesFileName = path.resolve(
  __dirname,
  "../out/addresses-ser.txt"
);
const deserializedJsonFile = path.resolve(
  __dirname,
  "../out/addresses-trie-deser.json"
);

async function main() {
  const names: string[][] = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const trie = createAndPopulateTrie(names);

  writeAndLogSize(outFile, JSON.stringify(trie));

  const serializedTrie = serializeTrie(trie.getTrie());
  writeAndLogSize(serializedTrieFileName, serializedTrie);
  writeAndLogSize(
    deserializedJsonFile,
    JSON.stringify(deserializeTrie(serializedTrie))
  );

  const serializedNames = encodeNames(new Set(getAddresses()));
  writeAndLogSize(serializedAddressesFileName, serializedNames);
}

main();
