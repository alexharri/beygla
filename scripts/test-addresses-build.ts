import { execSync } from "child_process";

const output = execSync(`npm run test:addresses-build`, {
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

if (!output.includes("Testing built 'beygla/addresses' module.")) {
  throw new Error(
    `Expected test output to include 'Testing built 'beygla/addresses' module'.`
  );
}

console.log(`Ran test build successfully.`);
