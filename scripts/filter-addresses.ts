// This script filters the very, very large 'word-cases.csv' file into a
// 'address-cases.csv' file that only contains the lines in 'word-cases.csv' that
// correspond to addresses contained in 'icelandic-addresses.json'.

import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { getAddresses } from "../lib/preprocess/data/getNames";
import { logWriteAndSize } from "../lib/preprocess/utils/gzip";
import { getRawName } from "../lib/preprocess/format/name";
import { isFirstVariationOfCase } from "../lib/preprocess/format/case";

const addressCasesCsvFilePath = path.resolve(
  __dirname,
  "../out/address-cases.csv"
);
const wordCasesCsvFilePath = path.resolve(__dirname, "../data/word-cases.csv");

async function main() {
  await fs.writeFile(addressCasesCsvFilePath, "", "utf-8");
  const inputFile = await fs.open(wordCasesCsvFilePath);

  const outStream = fsSync.createWriteStream(addressCasesCsvFilePath, "utf-8");

  let nInputLines = 0;
  let nOutputLines = 0;

  const addressSet = new Set(getAddresses());

  for await (const line of inputFile.readLines()) {
    if (line === "") continue;
    nInputLines++;

    const name = getRawName(line);
    if (!addressSet.has(name.base)) {
      continue;
    }
    if (!isFirstVariationOfCase(name.case)) {
      continue;
    }

    outStream.write(line + "\n");
    nOutputLines++;
  }

  console.log(`Filtered ${nInputLines} entries into ${nOutputLines} entries.`);

  logWriteAndSize(addressCasesCsvFilePath);
}

main();
