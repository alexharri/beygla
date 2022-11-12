import { Case } from "../../compress/types";

export function getCase(caseString: string): Case {
  switch (caseString) {
    case "NFET":
      return Case.Nominative;
    case "ÞFET":
    case "ÞFET2":
    case "ÞFET3":
      /** @todo only use one of these, not both */
      return Case.Accusative;
    case "ÞGFET":
    case "ÞGFET2":
    case "ÞGFET3":
      /** @todo only use one of these, not both */
      return Case.Dative;
    case "EFET":
    case "EFET2":
      /** @todo only use one of these, not both */
      return Case.Genitive;
    default:
      throw new Error(`Unexpected case '${caseString}'`);
  }
}

export function isCasePlural(caseString: string): boolean {
  switch (caseString) {
    case "NFFT":
    case "ÞFFT":
    case "ÞGFFT":
    case "EFFT":
    case "EFFT2":
      return true;
    case "NFET":
    case "ÞFET":
    case "ÞFET2":
    case "ÞFET3": // Some haves have three valid 'ÞFET'
    case "ÞGFET":
    case "ÞGFET2":
    case "ÞGFET3": // Some haves have three valid 'ÞGFET'
    case "EFET":
    case "EFET2": // Some haves have two valid 'EFET'
      return false;
    default:
      throw new Error(`Unexpected case '${caseString}'`);
  }
}
