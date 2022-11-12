import typescript from "@rollup/plugin-typescript";

const config = {
  input: "lib/beygla.ts",
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

export default config;
