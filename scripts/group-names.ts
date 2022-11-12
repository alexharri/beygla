import path from "path";
import fs from "fs";
import { getNames } from "../src/preprocess/data/getNames";
import { isDefiniteArticle } from "../src/preprocess/format/article";
import { isCasePlural } from "../src/preprocess/format/case";
import { formatName, getRawName } from "../src/preprocess/format/name";
import { Case, DeclinedName } from "../src/types/Types";
import { readGzippedFileLines } from "../src/preprocess/utils/gzip";

const namesFilePath = path.resolve(__dirname, "../out/names.csv.gz");

async function main() {
  const lines = await readGzippedFileLines(namesFilePath);

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

  const filePath = path.resolve(__dirname, "../out/grouped-names.json");
  fs.writeFileSync(filePath, JSON.stringify(out, null, 2), "utf-8");
}

main();
