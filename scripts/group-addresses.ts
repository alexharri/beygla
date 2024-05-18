import path from "path";
import fs from "fs/promises";
import { getAddresses } from "../lib/preprocess/data/getNames";
import { isDefiniteArticle } from "../lib/preprocess/format/article";
import { isCasePlural } from "../lib/preprocess/format/case";
import { formatName, getRawName } from "../lib/preprocess/format/name";
import { Case, DeclinedName, WordCategory } from "../lib/compress/types";
import { writeAndLogSize } from "../lib/preprocess/utils/gzip";
import assert from "assert";

const addressCasesFilePath = path.resolve(
  __dirname,
  "../out/address-cases.csv"
);

const categoriesInOrderOfPreference = [
  WordCategory.StreetNames,
  WordCategory.PlaceNames,
  WordCategory.UrbanAreas,
  WordCategory.CountiesOrNeighborhoodsOrRegions,
  WordCategory.Structures,
  WordCategory.CompanyOrOrganizationName,
  WordCategory.GeographicalNames,
  WordCategory.NonIcelandicGeographicalNames,
  WordCategory.PersonNames,
  WordCategory.OtherNames,
  WordCategory.CountryNames,
  WordCategory.Animals, // There is a place called "Fluga", which literally translates to "Fly"
  WordCategory.General,
] as string[];

async function main() {
  const fileContent = await fs.readFile(addressCasesFilePath, "utf-8");
  const lines = fileContent.split("\n");

  const addresses = getAddresses();
  const addressSet = new Set(addresses);

  const configs = [
    { split: false, postfix: "with-dash" },
    { split: true, postfix: "split-dash" },
  ];
  for (const { split, postfix } of configs) {
    const groups: Record<string, DeclinedName[]> = {};

    for (const line of lines) {
      if (line === "") continue;
      const rawName = getRawName(line);

      if (!addressSet.has(rawName.base)) {
        continue;
      }

      if (isDefiniteArticle(rawName.case) || isCasePlural(rawName.case)) {
        continue;
      }

      const formattedNames: DeclinedName[] = [];

      const baseSplit = split ? rawName.base.split("-") : [rawName.base];
      const nameSplit = split ? rawName.name.split("-") : [rawName.name];
      if (baseSplit.length !== nameSplit.length) {
        throw new Error("Expected same number of parts");
      }
      for (let i = 0; i < baseSplit.length; i++) {
        formattedNames.push(
          formatName({
            ...rawName,
            base: baseSplit[i],
            name: nameSplit[i],
          })
        );
      }

      for (const name of formattedNames) {
        if (!groups[name.base]) groups[name.base] = [];
        groups[name.base]!.push(name);
      }
    }

    const out: string[][] = [];

    const addressesWithMultipleGenders = new Set();

    for (const names of Object.values(groups)) {
      const byCategory: {
        [category: string]: {
          [gender: string]: {
            [_case: string]: DeclinedName;
          };
        };
      } = {};

      for (const name of names) {
        let _case;
        switch (name.case) {
          case Case.Nominative:
            _case = "nf";
            break;
          case Case.Accusative:
            _case = "þf";
            break;
          case Case.Dative:
            _case = "þgf";
            break;
          case Case.Genitive:
            _case = "ef";
            break;
          default:
            throw new Error(`Unexpected case '${name.case}'`);
        }
        for (const category of name.categories) {
          byCategory[category] ||= {};
          byCategory[category][name.gender] ||= {};
          byCategory[category][name.gender][_case] ||= name;
        }
      }

      let category: string | undefined;
      const categories = Object.keys(byCategory);

      assert(categories.length > 0, "should have at least 1 category");

      for (const preferredCategory of categoriesInOrderOfPreference) {
        if (categories.includes(preferredCategory)) {
          category = preferredCategory;
          break;
        }
      }
      if (!category) {
        throw new Error(
          `No preferred category matched in list [${categories.join(
            ", "
          )}] for name '${names[0].base}'`
        );
      }

      const byGender = byCategory[category];

      let gender: string;
      const genders = Object.keys(byGender);
      assert(genders.length > 0, "should have at least 1 gender");
      if (genders.length > 1) {
        addressesWithMultipleGenders.add(names[0].base);
        continue;
      } else {
        gender = genders[0];
      }

      const byCase = byGender[gender];
      const { nf, þf, þgf, ef } = byCase;

      if (!nf || !þf || !þgf || !ef) {
        throw new Error(`Missing case for name '${names[0].base}'`);
      }

      out.push([nf.name, þf.name, þgf.name, ef.name]);
    }

    const excludedNames = [...addressSet].filter((name) => !groups[name]);

    if (!split) {
      const ratio = excludedNames.length / addresses.length;
      const percentage = (ratio * 100).toFixed(2) + "%";
      console.log(
        `${excludedNames.length} of ${addresses.length} addresses (${percentage}) in 'address-cases.csv' are not present in 'words.csv' and are not included.\n`
      );
      console.log(
        `Found ${addressesWithMultipleGenders.size} addresses with multiple genders. They are omitted from Beygla.\n`
      );
    }

    const groupedAddressesFilePath = path.resolve(
      __dirname,
      `../out/grouped-addresses-${postfix}.json`
    );
    writeAndLogSize(groupedAddressesFilePath, JSON.stringify(out, null, 2));

    if (!split) {
      const excludedAddressesfilePath = path.resolve(
        __dirname,
        "../out/excluded-addresses.json"
      );
      writeAndLogSize(
        excludedAddressesfilePath,
        JSON.stringify(excludedNames, null, 2)
      );
    }
  }
}

main();
