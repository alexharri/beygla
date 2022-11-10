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
