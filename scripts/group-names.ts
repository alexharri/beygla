import path from "path";
import fs from "fs/promises";
import { getNames } from "../lib/preprocess/data/getNames";
import { isDefiniteArticle } from "../lib/preprocess/format/article";
import { isCasePlural } from "../lib/preprocess/format/case";
import { formatName, getRawName } from "../lib/preprocess/format/name";
import { Case, DeclinedName, WordCategory } from "../lib/compress/types";
import { writeAndLogSize } from "../lib/preprocess/utils/gzip";
import assert from "assert";

const nameCasesFilePath = path.resolve(__dirname, "../out/name-cases.csv");

// Some names (e.g. Eldey) can both be a personal name (eigin nafn) and the name
// of a company/organization (stofnunar- eða fyrirtækisheiti).
//
// These are not always declined in the same manner. See the following explainer
// from BÍN for an example:
//
//    https://bin.arnastofnun.is/korn/7
//
// There's LOTS of word categories, with various degrees of overlap. All of the
// following categories contain at least one legal Icelandic name.
//
// The following list specifies the "category preference order". If a name
// exists in multiple categories, the first category in the list will be picked.
//
// PS: Aside from the first few elements, this ordering is mostly arbitrary. If
//     reasons for preferring one category over another is discovered, then this
//     list can be amended.
//
const categoriesInOrderOfPreference = [
  WordCategory.PersonNames,
  WordCategory.NonIcelandicPersonNames,
  WordCategory.Nicknames,
  WordCategory.MythicalName,
  WordCategory.FamilyNames,
  WordCategory.GeographicalNames,
  WordCategory.PlaceNames,
  WordCategory.AstrologicalNames,
  WordCategory.OtherNames,
  WordCategory.NonIcelandicGeographicalNames,
  WordCategory.CountryNames,
  WordCategory.StreetNames,
  WordCategory.CategoriesOfPeoples,
  WordCategory.CompanyOrOrganizationName,
  WordCategory.General,
] as string[];

async function main() {
  const fileContent = await fs.readFile(nameCasesFilePath, "utf-8");
  const lines = fileContent.split("\n");

  const names = getNames();
  const nameSet = new Set(names);

  const groups: Record<string, DeclinedName[]> = {};

  for (const line of lines) {
    const rawName = getRawName(line);

    if (!nameSet.has(rawName.base)) {
      continue;
    }

    if (isDefiniteArticle(rawName.case) || isCasePlural(rawName.case)) {
      continue;
    }

    const name = formatName(rawName);
    if (!groups[name.base]) {
      groups[name.base] = [];
    }
    groups[name.base]!.push(name);
  }

  const out: string[][] = [];

  const namesWithMultipleGenders = new Set();
  const namesWithMultipleDeclensions = new Set();

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
      byCategory[name.category] ||= {};
      byCategory[name.category][name.gender] ||= {};
      if (byCategory[name.category][name.gender][_case]) {
        namesWithMultipleDeclensions.add(name.base);
      }
      byCategory[name.category][name.gender][_case] ||= name;
    }

    let category: string | undefined;
    const categories = Object.keys(byCategory);

    assert(categories.length > 0, "should have at least 1 category");

    if (
      categories.length === 1 &&
      ["gæl,ism", "dýr,hetja"].includes(categories[0])
    ) {
      // This seems like a data entry error, for which BÍN should be contacted.
      // These occur for 1 word each.
      //
      // Anyway, ignore these while they are sorted out in the source.
      continue;
    }

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
    assert(genders.length > 0, "should have at least 1 genders");
    if (genders.length > 1) {
      namesWithMultipleGenders.add(names[0].base);
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

  const excludedNames = [...nameSet].filter((name) => !groups[name]);

  const ratio = excludedNames.length / names.length;
  const percentage = (ratio * 100).toFixed(2) + "%";

  console.log(
    `${excludedNames.length} of ${names.length} names (${percentage}) in 'name-cases.csv' are not present in 'words.csv' and are not included.\n`
  );

  console.log(
    `Found ${namesWithMultipleDeclensions.size} names with multiple declensions. The last declension is used.`
  );
  console.log(
    `Found ${namesWithMultipleGenders.size} names with multiple genders. They are omitted from Beygla.\n`
  );

  const groupedNamesfilePath = path.resolve(
    __dirname,
    "../out/grouped-names.json"
  );
  const excludedNamesfilePath = path.resolve(
    __dirname,
    "../out/excluded-names.json"
  );
  writeAndLogSize(groupedNamesfilePath, JSON.stringify(out, null, 2));
  writeAndLogSize(
    excludedNamesfilePath,
    JSON.stringify(excludedNames, null, 2)
  );
}

main();
