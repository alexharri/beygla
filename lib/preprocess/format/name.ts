import { DeclinedName, UnprocessedName as RawName } from "../../compress/Types";
import { getCase } from "./case";
import { getGender } from "./gender";

export function getRawName(line: string): RawName {
  const [base, _id, gender, name, caseString] = line.split(";");

  return {
    base,
    gender,
    case: caseString,
    name,
  };
}

export function formatName(name: RawName): DeclinedName {
  const nameCase = getCase(name.case);
  const gender = getGender(name.gender);

  return {
    base: name.base,
    name: name.name,
    case: nameCase,
    gender,
  };
}
