import { execSync } from "child_process";

const output = execSync(`npm run test:build`, {
  encoding: "utf-8",
  stdio: "pipe",
});

console.log(
  "Output:\n" +
    output
      .split("\n")
      .map((line) => `\t${line}`)
      .join("\n")
);

if (!output.includes("Testing built module.")) {
  throw new Error(`Expected test output to include 'Testing built module'.`);
}

console.log(`Ran test build successfully.`);
