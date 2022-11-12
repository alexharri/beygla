import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { getNames } from "../lib/preprocess/data/getNames";
import { gzipFile } from "../lib/preprocess/utils/gzip";

const outputFilePath = path.resolve(__dirname, "../out/names.csv");
const inputFilePath = path.resolve(__dirname, "../data/words.csv");

async function main() {
  const start = Date.now();

  await fs.writeFile(outputFilePath, "", "utf-8");
  const inputFile = await fs.open(inputFilePath);

  const outStream = fsSync.createWriteStream(outputFilePath, "utf-8");

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

  await gzipFile(outputFilePath);
}

main();
