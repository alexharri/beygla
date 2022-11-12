import fs from "fs";
import path from "path";
import terser from "terser";
import { filesize } from "filesize";
import { execSync } from "child_process";
import gzipSize from "gzip-size";

async function main() {
  const DIST_DIR = path.resolve(__dirname, "../dist/");
  const OUT_DIR = path.resolve(__dirname, "../out/");

  const run = (command: string) => execSync(command, { stdio: "inherit" });

  // Remove old build
  run(`rm -rf dist/`);

  // Build '.d.ts' and '.js' files
  run(`rollup -c --bundleConfigAsCjs`);

  // Copy package.json and README.md into 'dist/' dir
  run(`cp README.md package.json dist/`);

  // Remove 'dist/common/' and 'dist/read/'
  run(`rm -rf dist/common/ dist/read/`);

  const emittedJsFileNames = ["beygla.js", "beygla.esm.js"];

  const filesThatShouldExist = new Set([
    "package.json",
    "README.md",
    "beygla.d.ts",
    ...emittedJsFileNames,
  ]);

  const fileNames = fs.readdirSync(DIST_DIR);

  if (fileNames.length !== filesThatShouldExist.size) {
    throw new Error(
      `Expected ${filesThatShouldExist.size} files, got '${fileNames.length}'`
    );
  }

  for (const fileName of fileNames) {
    if (!filesThatShouldExist.has(fileName)) {
      throw new Error(`Unexpected file/directory '${fileName}'`);
    }
  }

  const serializedTrie = fs.readFileSync(
    path.resolve(OUT_DIR, "./trie-ser.txt"),
    "utf-8"
  );

  if (serializedTrie.length < 1000) {
    throw new Error(
      `Serialized trie is unexpectedly short (${serializedTrie.length} characters).`
    );
  }

  for (const fileName of emittedJsFileNames) {
    const filePath = path.resolve(DIST_DIR, fileName);
    let fileContent = fs.readFileSync(filePath, "utf-8");
    if (!fileContent.includes(`serializedInput = "@@input@@"`)) {
      throw new Error(
        `Expected '${fileName}' to include 'serializedInput = "@@input@@"'`
      );
    }
    fileContent = fileContent.replace(
      `serializedInput = "@@input@@"`,
      `serializedInput = "${serializedTrie}"`
    );
    fs.writeFileSync(filePath, fileContent, "utf-8");
  }

  console.log("Output size:");

  for (const fileName of emittedJsFileNames) {
    const filePath = path.resolve(DIST_DIR, fileName);
    const fileContent = fs.readFileSync(filePath, "utf-8");

    const minified = (await terser.minify(fileContent)).code!;
    const minifiedSize = filesize(minified.length);
    const gzippedSize = filesize(gzipSize.sync(minified));

    console.log(`\t${fileName}`);
    console.log(`\t\tMinified: ${minifiedSize}`);
    console.log(`\t\tGzipped: ${gzippedSize}`);
  }
}

main();
