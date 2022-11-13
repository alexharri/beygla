import path from "path";
import fs from "fs";
import yauzl from "yauzl";
import { execSync } from "child_process";

const zipFilePath = path.resolve(__dirname, "../data/words.zip");
const csvFilePath = path.resolve(__dirname, "../data/words.csv");

console.log(`Downloading file\n`);

execSync(
  `curl -o ${zipFilePath} https://bin.arnastofnun.is/django/api/nidurhal/?file=Storasnid_beygm.csv.zip`,
  { stdio: "inherit" }
);

console.log("\nDownloaded file successfully. Unzipping it.");

const unzip = async () => {
  await new Promise<void>((resolve, reject) => {
    const writeStream = fs.createWriteStream(csvFilePath, "utf-8");

    yauzl.open(zipFilePath, (err, zipfile) => {
      if (err) {
        reject(err);
        return;
      }
      zipfile.on("entry", (entry) => {
        if (entry.fileName === "Storasnid_beygm.csv.sha256sum") return;
        if (entry.fileName === "Storasnid_beygm.csv") {
          zipfile.openReadStream(entry, (err, readStream) => {
            if (err) {
              reject(err);
              return;
            }
            readStream.on("end", () => resolve());
            readStream.pipe(writeStream);
          });
          return;
        }
        reject(new Error(`Unexpected file name '${entry.fileName}'`));
      });
    });
  });

  fs.rmSync(zipFilePath);

  console.log(`Successfully unzipped words.csv`);
};

unzip();
