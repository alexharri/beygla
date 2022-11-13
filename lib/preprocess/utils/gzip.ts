import fs from "fs";
import zlib from "zlib";
import { filesize } from "filesize";
import gzipSize from "gzip-size";

export async function gzipFile(filePath: string) {
  const stream = fs.createReadStream(filePath);
  stream
    .pipe(zlib.createGzip())
    .pipe(fs.createWriteStream(filePath + ".gz"))
    .on("finish", () => {
      const beforeZip = fs.statSync(filePath);
      const afterZip = fs.statSync(filePath + ".gz");

      const percentage = ((afterZip.size / beforeZip.size) * 100).toFixed(2);

      const parts = filePath.split("/");
      const fileName = parts[parts.length - 1];

      console.log(
        `Compressed '${fileName}.gz' to ${percentage}% of the original size`
      );
    });
}

export function logWriteAndSize(filePath: string) {
  const content = fs.readFileSync(filePath);

  const baseLength = content.length;
  const gzipLength = gzipSize.sync(content);

  const baseSize = filesize(baseLength);
  const gzippedSize = filesize(gzipLength);

  const percentage = ((gzipLength / baseLength) * 100).toFixed(2);

  const parts = filePath.split("/");
  const fileName = parts[parts.length - 1];

  console.log(
    `Created file '${fileName}'\n\tSize:\t\t${baseSize}\n\tGzip size:\t${gzippedSize} (${percentage}%)`
  );
}

export function writeAndLogSize(filePath: string, content: string) {
  fs.writeFileSync(filePath, content, "utf-8");
  logWriteAndSize(filePath);
}
