import {
  DeclinedName,
  UnprocessedName,
  WordCategory,
} from "../../compress/types";
import { getCase } from "./case";

export function getRawName(line: string): UnprocessedName {
  // Properties prefixed with '_bin' have not been translated.
  //
  // See https://bin.arnastofnun.is/gogn/k-snid
  const [
    base,
    _id,
    gender,
    category,
    _bin_einkunn,
    _bin_malsnid_ords,
    _bin_malfraedi,
    _bin_millivisun,
    _bin_birting,
    name,
    caseString,
  ] = line.split(";");

  return {
    base,
    case: caseString,
    name,
    categories: category.split(",") as WordCategory[],
    gender,
  };
}

export function formatName(name: UnprocessedName): DeclinedName {
  const nameCase = getCase(name.case);

  return {
    base: name.base,
    name: name.name,
    case: nameCase,
    categories: name.categories,
    gender: name.gender,
  };
}
