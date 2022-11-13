import { execSync } from "child_process";

const [script, ...rest] = process.argv.slice(2);
const args = rest.join(" ");

if (args) {
  console.log(`Running '${script}' with args ${args}\n`);
} else {
  console.log(`Running '${script}'\n`);
}

const start = Date.now();

execSync(`npx ts-node -T ./scripts/${script} ${args}`, { stdio: "inherit" });

const timeMs = Date.now() - start;
console.log(`\nRan script '${script}' in ${timeMs}ms`);
