import fs from "fs";
import path from "path";

export function getNames(): string[] {
  const fileContent = fs.readFileSync(
    path.resolve(__dirname, "../../../out/icelandic-names.json"),
    "utf-8"
  );
  const names = JSON.parse(fileContent) as string[];
  return names.filter((name) => !name.includes(" "));
}
