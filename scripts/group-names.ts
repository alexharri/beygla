import path from "path";
import fs from "fs/promises";
import { getNames } from "../lib/preprocess/data/getNames";
import { isDefiniteArticle } from "../lib/preprocess/format/article";
import { isCasePlural } from "../lib/preprocess/format/case";
import { formatName, getRawName } from "../lib/preprocess/format/name";
import { Case, DeclinedName } from "../lib/compress/types";
import { writeAndLogSize } from "../lib/preprocess/utils/gzip";

const nameCasesFilePath = path.resolve(__dirname, "../out/name-cases.csv");

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

  for (const names of Object.values(groups)) {
    let nf: DeclinedName | undefined;
    let þf: DeclinedName | undefined;
    let þgf: DeclinedName | undefined;
    let ef: DeclinedName | undefined;

    for (const name of names) {
      switch (name.case) {
        case Case.Nominative:
          nf = name;
          break;
        case Case.Accusative:
          þf = name;
          break;
        case Case.Dative:
          þgf = name;
          break;
        case Case.Genitive:
          ef = name;
          break;
        default:
          throw new Error(`Unexpected case '${name.case}'`);
      }
    }

    if (!nf || !þf || !þgf || !ef) {
      throw new Error(`Missing case for name '${names![0].base}'`);
    }

    out.push([nf.name, þf.name, þgf.name, ef.name]);
  }

  const excludedNames = [...nameSet].filter((name) => !groups[name]);

  const ratio = excludedNames.length / names.length;
  const percentage = (ratio * 100).toFixed(2) + "%";

  console.log(
    `${excludedNames.length} of ${names.length} names (${percentage}) in 'name-cases.csv' are not present in 'words.csv' and are not included.\n`
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
