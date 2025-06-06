import "./test/mockAddresses";
import * as _beygla from "./beygla";
import groupedAddressesWithDash from "../out/grouped-addresses-with-dash.json";
import serializedInput from "./read/serializedInput";
import mode from "./read/mode";

let beygla = _beygla;

const testingBuild = process.env.TEST_BUILD === "true";
if (testingBuild) {
  // We specifically check for the precense of this message in the
  // 'test-addresses-build' script to make sure that we actually ran
  // the test on the build output.
  console.log("Testing built 'beygla/addresses' module.");

  beygla = require("../dist/addresses.esm.js");
}

const knownProblemAddresses = [
  // Singular
  "Efri-Hreppur",
  "Efri-Núpur",
  "Efsta-Grund",
  "Forna-Krossnes",
  "Hóll",
  "Hvoll",
  "Litla-Ásgeirsá",
  "Litla-Borg",
  "Litla-Breiðuvík",
  "Litla-Brekka",
  "Litla-Dímon",
  "Litla-Drageyri",
  "Litla-Eyri",
  "Litla-Giljá",
  "Litla-Grund",
  "Litla-Gröf",
  "Litla-Heiði",
  "Litla-Hvalsá",
  "Litla-Sandvík",
  "Litla-Tunga",
  "Litli-Hóll",
  "Meiri-Hattardalur",
  "Meiri-Tunga",
  "Minni-Borg",
  "Minni-Brekka",
  "Minni-Grindill",
  "Minni-Hattardalur",
  "Minni-Mástunga",
  "Minni-Núpur",
  "Neðri-Ás",
  "Neðri-Háls",
  "Neðri-Hóll",
  "Neðri-Hreppur",
  "Neðri-Núpur",
  "Nýja-Sjáland",
  "Stóra-Ármót",
  "Stóra-Búrfell",
  "Stóra-Fjall",
  "Stóra-Fjarðarhorn",
  "Stóra-Hildisey",
  "Stóra-Hof",
  "Stóra-Hraun",
  "Stóra-Mörk",
  "Stóra-Núpskirkja",
  "Stóra-Sandfell",
  "Stóra-Steinsvað",
  "Stóra-Vatnshorn",
  "Stóra-Vatnsskarð",
  "Stóri-Ás",
  "Stóri-Botn",
  "Stærri-Árskógur",
  "Syðri-Hóll",
  "Syðri-Völlur",
  "Syðsta-Grund",
  "Syðsta-Mörk",
  "Ysti-Hóll",
  "Ytri-Bakki",
  "Ytri-Hóll",
  "Ytri-Hólmur",
  "Ytri-Ós",

  // Plural
  "Efsta-Kot",
  "Garðar",
  "Kot",
  "Minni-Akrar",
  "Minni-Ólafsvellir",
  "Minni-Reykir",
  "Minni-Vellir",
  "Ásar",
];

const { applyCase } = beygla;

describe("beygla/addresses", () => {
  describe("applyCase", () => {
    it("mocks the serialized input", () => {
      expect(serializedInput).not.toEqual("@@input@@");
      expect(serializedInput.startsWith("{")).toEqual(true);
    });

    it("mocks the mode", () => {
      expect(mode).toEqual("addresses");
    });

    it("applies a case to an address", () => {
      const out = applyCase("ef", "Katrínarlind");
      expect(out).toEqual("Katrínarlindar");
    });

    it("correctly applies every case to every name (aside from known problem names)", () => {
      for (const addresses of groupedAddressesWithDash) {
        const addressNominativeCase = addresses[0];

        if (knownProblemAddresses.includes(addressNominativeCase)) continue;

        const cases = ["nf", "þf", "þgf", "ef"] as const;
        for (const [i, caseStr] of cases.entries()) {
          const expected = addresses[i];
          const actual = applyCase(caseStr, addressNominativeCase);
          expect(actual).toEqual(expected);
        }
      }
    });

    it("applies a case to an address with a number", () => {
      expect(applyCase("ef", "Katrínartún 4")).toEqual("Katrínartúns 4");
      expect(applyCase("þf", "Rauðalækur 63")).toEqual("Rauðalæk 63");
    });

    it("strips whitespace", () => {
      const sourceName = "  \n  Rauðalækur  \t63\n";
      expect(applyCase("þf", sourceName)).toEqual("Rauðalæk 63");
    });

    it("applies cases to addresses that only exist in the plural case", () => {
      const cases = ["nf", "þf", "þgf", "ef"] as const;
      const names = [
        ["Álfheimar", "Álfheima", "Álfheimum", "Álfheima"],
        ["Glaðheimar", "Glaðheima", "Glaðheimum", "Glaðheima"],
      ];
      for (const group of names) {
        const base = group[0];
        for (const [i, caseStr] of cases.entries()) {
          expect(applyCase(caseStr, base)).toEqual(group[i]);
        }
      }
    });
  });
});
