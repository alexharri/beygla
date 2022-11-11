import fs from "fs/promises";
import fsSync from "fs";
import zlib from "zlib";
import path from "path";
import { getNames } from "../src/preprocess/data/getNames";

const outputFilePath = path.resolve(__dirname, "../out/names.csv");
const inputFilePath = path.resolve(__dirname, "../data/words.csv");

async function gzip() {
  const stream = fsSync.createReadStream(outputFilePath);
  stream
    .pipe(zlib.createGzip())
    .pipe(fsSync.createWriteStream(outputFilePath + ".gz"))
    .on("finish", () => {
      const beforeZip = fsSync.statSync(outputFilePath);
      const afterZip = fsSync.statSync(outputFilePath + ".gz");

      const ratio = ((afterZip.size / beforeZip.size) * 100).toFixed(2);

      console.log(
        `Compressed output into a '.gz' file that is ${ratio}% of the original size`
      );
    });
}

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

  await gzip();
}

main();
