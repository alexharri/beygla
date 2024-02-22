import typescript from "@rollup/plugin-typescript";

const mainConfig = {
  input: ["lib/beygla.ts"],
  external: [],
  output: [
    { file: `dist/beygla.js`, format: "cjs", exports: "auto" },
    { file: `dist/beygla.esm.js`, format: "es" },
  ],
  plugins: [
    typescript({
      tsconfig: "./tsconfig.declaration.json",

      declaration: true,
      declarationDir: "../dist-types",
    }),
  ],
};
const strictConfig = {
  input: ["lib/strict.ts"],
  external: [],
  output: [
    { file: `dist/strict.js`, format: "cjs", exports: "auto" },
    { file: `dist/strict.esm.js`, format: "es" },
  ],
  plugins: [
    typescript({
      tsconfig: "./tsconfig.declaration.json",

      declaration: true,
      declarationDir: "../dist-types",
    }),
  ],
};

export default [mainConfig, strictConfig];
