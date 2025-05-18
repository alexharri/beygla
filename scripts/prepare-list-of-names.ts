import path from "path";
import fs from "fs";
import { writeAndLogSize } from "../lib/preprocess/utils/gzip";

const allNamesFilePath = path.resolve(
  __dirname,
  "../data/icelandic-names.json"
);
const outFilePath = path.resolve(__dirname, "../out/icelandic-names.json");

function main() {
  const lines = JSON.parse(fs.readFileSync(allNamesFilePath, "utf-8")) as {
    name: string;
    status: string;
  }[];

  const names: string[] = [];

  for (const line of lines) {
    const { name, status } = line;

    switch (status) {
      case "Sam": // Accepted
        names.push(name);
        break;
      case "Haf": // Rejected
      case "Óaf": // Not processed
        break;
      default:
        throw new Error(`Unexpected status '${status}' for name ${name}`);
    }
  }

  // Ensure that the 'out/' dir exists.
  fs.mkdirSync(path.resolve(__dirname, "../out/"), { recursive: true });

  writeAndLogSize(outFilePath, JSON.stringify(names, null, 2));
}

main();
