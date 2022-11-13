import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const run = (command: string) => execSync(command, { stdio: "inherit" });

const hasDownloadedWords = fs.existsSync(
  path.resolve(__dirname, "../data/word-cases.csv")
);

if (!hasDownloadedWords) run(`npm run script -- download-words`);

const scripts = [
  "prepare-list-of-names",
  "filter-names",
  "group-names",
  "process-names",
  "sankey-diagram",
];

for (const script of scripts) {
  run(`npm run script -- ${script}`);
}

console.log("\n\nRan pipeline successfully.");
