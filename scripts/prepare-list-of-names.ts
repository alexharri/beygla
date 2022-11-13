import path from "path";
import fs from "fs";

const csvFilePath = path.resolve(__dirname, "../data/icelandic-names.csv");
const jsonFilePath = path.resolve(__dirname, "../out/icelandic-names.json");

function main() {
  const fileContent = fs.readFileSync(csvFilePath, "utf-8");
  const lines = fileContent.split("\n");

  const names: string[] = [];

  for (const line of lines) {
    let [id, name, decision] = line.split(",");

    // Skip malformed entry. I have filed a bug in the original data source:
    //
    //    https://github.com/island-is/island.is/issues/9010
    //
    if (id === "4638") continue;

    // The following names contain a decision of 'NULL'.
    //
    // All of these names are not present in 'word-cases.csv' so we treating
    // them as if they were rejected.
    switch (id) {
      case "4692": // Emelíta
      case "5113": // Ivý
        decision = `"Haf"`;
        break;
    }

    // Remove surrounding "" from name and decision
    name = name.substr(1, name.length - 2);
    decision = decision.substr(1, decision.length - 2);

    switch (decision) {
      case "Sam": // Accepted
        names.push(name);
        break;
      case "Haf": // Rejected
      case "Óaf": // Not processed
        break;
      default:
        throw new Error(`Unexpected decision '${decision}' on line '${line}'`);
    }
  }

  // Ensure that the 'out/' dir exists.
  fs.mkdirSync(path.resolve(__dirname, "../out/"), { recursive: true });

  fs.writeFileSync(jsonFilePath, JSON.stringify(names, null, 2), "utf-8");
}

main();
