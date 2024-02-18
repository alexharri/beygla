import "./test/mock";
import * as _beygla from "./beygla";
import serializedInput from "./read/serializedInput";
import groupedNames from "../out/grouped-names.json";
import icelandicNamesList from "../out/icelandic-names.json";

const icelandicNames = new Set(icelandicNamesList);

let beygla = _beygla;

// We only test the 'strict' module when the 'TEST_BUILD' parameter is
// set to 'true' because the 'strict' module mutates global state in
// beygla (via setPredicate).
//
// Global state is used to avoid polluting the interface of beygla's
// main function, 'applyCase'.
let beyglaStrict: typeof beygla | null = null;

const testingBuild = process.env.TEST_BUILD === "true";
if (testingBuild) {
  // We specifically check for the precense of 'Testing built module.' in
  // the 'test-build' script to make sure that we actually ran the test
  // on the build output.
  console.log("Testing built modules.");

  beygla = require("../dist/beygla.esm.js");
  beyglaStrict = require("../dist/strict.esm.js");
}

runTests(beygla, false);
if (beyglaStrict) runTests(beyglaStrict, true);

function runTests(beygla: typeof import("./beygla"), strict: boolean) {
  const { applyCase, getDeclensionForName } = beygla;

  describe(strict ? "beygla/strict" : "beygla", () => {
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

      if (!strict) {
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
      }

      if (strict) {
        it("correctly applies every case to every name in the 'icelandic-names' list", () => {
          for (const names of groupedNames) {
            const nameInNominative = names[0];

            if (!icelandicNames.has(nameInNominative)) continue;

            const cases = ["nf", "þf", "þgf", "ef"] as const;
            for (const [i, caseStr] of cases.entries()) {
              const nameInCase = applyCase(caseStr, nameInNominative);

              expect(nameInCase).toEqual(names[i]);
            }
          }
        });
      }

      if (!strict) {
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
      }

      it("applies a case to a full name", () => {
        const sourceName = "Gunnar Sigurberg Brjánsson";

        const out = applyCase("þgf", sourceName);

        expect(out).toEqual("Gunnari Sigurberg Brjánssyni");
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

      it("applies cases to suffixes as expected", () => {
        const cases = ["nf", "þf", "þgf", "ef"] as const;
        const nameGroups = [
          ["Jónsson", "Jónsson", "Jónssyni", "Jónssonar"],
          ["Jónsdóttir", "Jónsdóttur", "Jónsdóttur", "Jónsdóttur"],
          ["Jónsbur", "Jónsbur", "Jónsburi", "Jónsburs"],
        ];

        for (const group of nameGroups) {
          const base = group[0];

          for (const [i, caseStr] of cases.entries()) {
            expect(applyCase(caseStr, base)).toEqual(group[i]);
          }
        }
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

      it("finds correct declension for some unknown names", () => {
        const tests: Array<[name: string, declension: string]> = [
          ["Sotti", "1;i,a,a,a"],
          ["Sófía", "1;a,u,u,u"],
          ["Kórekur", "2;ur,,i,s"],
          ["Olivia", "1;a,u,u,u"],
          ["Caritas", "0;,,,ar"],
          ["Hávarr", "1;r,,i,s"],
          ["Ermenga", "1;a,u,u,u"],
          ["Fannþór", "0;,,i,s"],
          ["Ísbrá", "0;,,,r"],
          ["Sófús", "0;,,i,ar"],
          ["Kristólín", "0;,,,ar"],
          ["Jasper", "0;,,,s"],
          ["Agok", "0;,,,s"],
        ];

        for (const [name, declension] of tests) {
          expect(`${name}: ${getDeclensionForName(name)}`).toEqual(
            `${name}: ${declension}`
          );
        }
      });

      it("does not find a declension for some unknown names", () => {
        const tests: string[] = [
          "Emanuel",
          "Frederik",
          "Evan",
          "Lennon",
          "Artemis",
          "Kaín",
        ];

        for (const name of tests) {
          expect(`${name}: ${getDeclensionForName(name)}`).toEqual(
            `${name}: ${null}`
          );
        }
      });

      test("it uses the declensions for the person, not the company/organization", () => {
        const tests = [
          ["nf", "Eldey"],
          ["þf", "Eldeyju"],
          ["þgf", "Eldeyju"],
          ["ef", "Eldeyjar"],
        ] as const;

        for (const [_case, name] of tests) {
          expect(applyCase(_case, "Eldey")).toEqual(name);
        }
      });

      test("it does not apply declensions that can not possibly apply to a name", () => {
        // The name 'Maya' would previously match the declension for 'Tanya', which
        // is '4;anya,önyu,önyu,önyu'.
        //
        // The subtraction of 4 would erase the entire name. Applying the declension
        // is non-sensical.
        expect(getDeclensionForName("Maya")).toEqual(null);

        for (const caseStr of <const>["nf", "þf", "þgf", "ef"]) {
          expect(applyCase(caseStr, "Maya")).toEqual("Maya");
        }
      });

      if (strict) {
        it("does not apply cases to non-Icelandic names", () => {
          expect(applyCase("þgf", "Carlos")).toEqual("Carlos");
        });
      }

      if (!strict) {
        it("applies cases to non-Icelandic names", () => {
          expect(applyCase("þgf", "Carlos")).toEqual("Carlosi");
        });
      }
    });
  });
}
