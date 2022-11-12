import { DeclinedName, UnprocessedName } from "../../compress/types";
import { getCase } from "./case";

export function getRawName(line: string): UnprocessedName {
  const [base, _id, _gender, name, caseString] = line.split(";");

  return {
    base,
    case: caseString,
    name,
  };
}

export function formatName(name: UnprocessedName): DeclinedName {
  const nameCase = getCase(name.case);

  return {
    base: name.base,
    name: name.name,
    case: nameCase,
  };
}
