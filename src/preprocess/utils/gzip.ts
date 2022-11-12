import fs from "fs";
import zlib from "zlib";
import readline from "readline";

export async function readGzippedFileLines(filePath: string) {
  const lines: string[] = [];

  const readInterface = readline.createInterface({
    input: fs.createReadStream(filePath).pipe(zlib.createGunzip()),
    crlfDelay: Infinity,
  });

  for await (const line of readInterface) {
    lines.push(line);
  }

  return lines;
}

export async function gzipFile(filePath: string) {
  const stream = fs.createReadStream(filePath);
  stream
    .pipe(zlib.createGzip())
    .pipe(fs.createWriteStream(filePath + ".gz"))
    .on("finish", () => {
      const beforeZip = fs.statSync(filePath);
      const afterZip = fs.statSync(filePath + ".gz");

      const ratio = ((afterZip.size / beforeZip.size) * 100).toFixed(2);

      const parts = filePath.split("/");
      const fileName = parts[parts.length - 1];

      console.log(
        `Compressed '${fileName}.gz' to ${ratio}% of the original size`
      );
    });
}
