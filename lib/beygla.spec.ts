import { applyCase as _applyCase } from "./beygla";
import serializedInput from "./read/serializedInput";
import groupedNames from "../out/grouped-names.json";

let applyCase = _applyCase;

const testingBuild = process.env.TEST_BUILD === "true";
if (testingBuild) {
  // We specifically check for the precense of 'Testing built module.' in
  // the 'test-build' script to make sure that we actually ran the test
  // on the build output.
  console.log("Testing built module.");

  applyCase = require("../dist/beygla.esm.js").applyCase;
}

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
    type Test = [source: string, caseStr: Case, expected: string];
    const tests: Test[] = [
      ["fantasía", "þf", "fantasíu"],
      ["Mamma", "ef", "Mömmu"],
    ];

    for (const [source, caseStr, expected] of tests) {
      const out = applyCase(caseStr, source);

      expect(out).toEqual(expected);
    }
  });

  it("applies a case to a full name", () => {
    const sourceName = "Gunnar Sigurberg Brjánsson";

    const out = applyCase("þgf", sourceName);

    expect(out).toEqual("Gunnari Sigurbergi Brjánssyni");
  });

  it("strips whitespace in full names", () => {
    const sourceName = "  \n  Hildigerður  Oddný\tPatreksdóttir  \n\n";

    const out = applyCase("þf", sourceName);

    expect(out).toEqual("Hildigerði Oddnýju Patreksdóttur");
  });

  it("applies a case to a first and middle name", () => {
    const sourceName = "Þorleifur Sigþór";

    const out = applyCase("ef", sourceName);

    expect(out).toEqual("Þorleifs Sigþórs");
  });

  it("applies a case only the last name", () => {
    const sourceName = "Ríkharðsdóttir";

    const out = applyCase("ef", sourceName);

    expect(out).toEqual("Ríkharðsdóttur");
  });

  it("applies a case to the first and last name", () => {
    const sourceName = "Magnús Herleifsson";

    const out = applyCase("þgf", sourceName);

    expect(out).toEqual("Magnúsi Herleifssyni");
  });

  it("applies a case to only 'son' or 'dóttir'", () => {
    const son = applyCase("þgf", "son");
    const dottir = applyCase("þgf", "dóttir");

    expect(son).toEqual("syni");
    expect(dottir).toEqual("dóttur");
  });
});
