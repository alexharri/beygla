import fs from "fs";
import path from "path";

export function getNames(): string[] {
  const fileContent = fs.readFileSync(
    path.resolve(__dirname, "../../../data/names.json"),
    "utf-8"
  );
  return JSON.parse(fileContent);
}