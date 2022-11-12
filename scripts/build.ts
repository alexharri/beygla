import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const DIST_DIR = path.resolve(__dirname, "../dist/");

// Remove old build
execSync(`rm -rf dist/`);

// Build '.d.ts' and '.js' files
execSync(`rollup -c --bundleConfigAsCjs`);

// Copy package.json and README.md into 'dist/' dir
execSync(`cp README.md package.json dist/`);

// Remove 'dist/common/' and 'dist/read/'
execSync(`rm -rf dist/common/ dist/read/`);

// There should be no more directories
for (const fileName of fs.readdirSync(DIST_DIR)) {
  const filePath = path.resolve(DIST_DIR, fileName);
  if (fs.lstatSync(filePath).isDirectory()) {
    throw new Error(`Unexpected directory '${filePath}'`);
  }
}

function assertFileExists(filePath: string) {
  if (fs.existsSync(filePath)) return;
  throw new Error(`Expected '${filePath}' to exist.`);
}

const filesThatShouldExist = [
  "package.json",
  "README.md",
  "beygla.js",
  "beygla.esm.js",
  "beygla.d.ts",
];

for (const fileName of filesThatShouldExist) {
  const filePath = path.resolve(DIST_DIR, fileName);
  assertFileExists(filePath);
}
