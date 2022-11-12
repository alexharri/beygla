import path from "path";
import fs from "fs";

const csvFilePath = path.resolve(__dirname, "../data/names.csv");
const jsonFilePath = path.resolve(__dirname, "../out/names.json");

function main() {
  const fileContent = fs.readFileSync(csvFilePath, "utf-8");
  const lines = fileContent.split("\n");

  const names: string[] = [];

  for (const line of lines) {
    let [, name, decision] = line.split(",");

    // I have seen one example of this
    if (decision === "NULL") continue;

    // Remove surrounding "" from name and decision
    name = name.substr(1, name.length - 2);
    decision = decision.substr(1, decision.length - 2);

    switch (decision) {
      case "Sam": // Accepted
      case "": // Older name, accepted by-default
        names.push(name);
        break;
      case "Haf": // Rejected
      case "Óaf": // Not processed
        break;
      default:
        throw new Error(`Unexpected decision '${decision}'`);
    }
  }

  fs.writeFileSync(jsonFilePath, JSON.stringify(names, null, 2), "utf-8");
}

main();
