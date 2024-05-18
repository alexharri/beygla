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

export function getAddresses(): string[] {
  const fileContent = fs.readFileSync(
    path.resolve(__dirname, "../../../out/icelandic-addresses.json"),
    "utf-8"
  );
  const addresses = JSON.parse(fileContent) as string[];
  return addresses.filter((name) => !name.includes(" "));
}
