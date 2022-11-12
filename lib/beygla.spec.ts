import { applyCase } from "./beygla";
import serializedInput from "./read/serializedInput";
import groupedNames from "../out/grouped-names.json";

jest.mock("./read/serializedInput", () => {
  const fs = require("fs");
  const path = require("path");

  const serializedTrieFilePath = path.resolve(__dirname, "../out/trie-ser.txt");
  const serializedTrie = fs.readFileSync(serializedTrieFilePath, "utf-8");

  return {
    __esModule: true,
    default: serializedTrie,
  };
});

describe("applyCase", () => {
  it("mocks the serialized input correctly", () => {
    expect(serializedInput).not.toEqual("@@input@@");
    expect(serializedInput.startsWith("{")).toEqual(true);
  });

  it("applies a case to a name", () => {
    const sourceName = "Jóhannes";

    const out = applyCase("ef", sourceName);

    expect(out).toEqual("Jóhannesar");
  });

  it("correctly applies every case to every name", () => {
    for (const names of groupedNames) {
      const nameInNominative = names[0];

      const cases = ["nf", "þf", "þgf", "ef"] as const;
      for (const [i, caseStr] of cases.entries()) {
        const nameInCase = applyCase(caseStr, nameInNominative);

        expect(nameInCase).toEqual(names[i]);
      }
    }
  });

  it("applies a cases to an input string as if it were a name", () => {
    type Case = "nf" | "þf" | "þgf" | "ef";
    const tests: Array<[source: string, caseStr: Case, expected: string]> = [
      ["fantasía", "þf", "fantasíu"],
      ["Mamma", "ef", "Mömmu"],
    ];

    for (const [source, caseStr, expected] of tests) {
      const out = applyCase(caseStr, source);

      expect(out).toEqual(expected);
    }
  });
});
