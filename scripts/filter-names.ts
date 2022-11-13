// This script filters the very, very large 'word-cases.csv' file into a
// 'name-cases.csv' file that only contains the lines in 'word-cases.csv' that
// correspond to names contained in from 'icelandic-names.json'.

import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { getNames } from "../lib/preprocess/data/getNames";
import { gzipFile } from "../lib/preprocess/utils/gzip";

const nameCasesCsvFilePath = path.resolve(__dirname, "../out/name-cases.csv");
const wordCasesCsvFilePath = path.resolve(__dirname, "../data/word-cases.csv");

async function main() {
  const start = Date.now();

  await fs.writeFile(nameCasesCsvFilePath, "", "utf-8");
  const inputFile = await fs.open(wordCasesCsvFilePath);

  const outStream = fsSync.createWriteStream(nameCasesCsvFilePath, "utf-8");

  let numerOfInputLines = 0;
  let numberOfNames = 0;

  const nameSet = new Set(getNames());

  for await (const line of inputFile.readLines()) {
    numerOfInputLines++;

    const name = line.split(";")[0];

    if (!nameSet.has(name)) {
      continue;
    }

    outStream.write(line + "\n");
    numberOfNames++;
  }

  const timeMs = Date.now() - start;

  console.log(
    `Processed ${numerOfInputLines} words into ${numberOfNames} names in ${timeMs} ms`
  );

  await gzipFile(nameCasesCsvFilePath);
}

main();
