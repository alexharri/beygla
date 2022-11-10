import path from "path";
import fs from "fs";
import zlib from "zlib";
import { createTrie } from "../src/trie/trie";

const filePath = path.resolve(__dirname, "../out/grouped-names.json");
const outFile = path.resolve(__dirname, "../out/trie.json");

async function main() {
  const names: string[][] = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const trie = createTrie(names);

  fs.writeFileSync(outFile, JSON.stringify(trie), "utf-8");

  const stream = fs.createReadStream(outFile);
  stream
    .pipe(zlib.createGzip())
    .pipe(fs.createWriteStream(outFile + ".gz"))
    .on("finish", () => {
      const beforeZip = fs.statSync(outFile);
      const afterZip = fs.statSync(outFile + ".gz");

      const ratio = ((afterZip.size / beforeZip.size) * 100).toFixed(2);

      console.log(
        `Compressed output into a '.gz' file that is ${ratio}% of the original size`
      );
    });
}

main();
