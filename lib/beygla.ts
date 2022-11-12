import { deserializeTrie } from "./read/deserialize";
import { extractDeclension } from "./read/extractDeclension";
import serializedInput from "./read/serializedInput";

const trie = deserializeTrie(serializedInput);

type Case =
  // Icelandic cases
  | "nf"
  | "þf"
  | "þgf"
  | "ef"
  // English cases
  | "nom"
  | "acc"
  | "dat"
  | "gen";

const casesIs: Case[] = ["nf", "þf", "þgf", "ef"];
const casesEn: Case[] = ["nom", "acc", "dat", "gen"];

function getCaseIndex(caseStr: Case) {
  const indexIs = casesIs.indexOf(caseStr);
  if (indexIs !== -1) return indexIs;
  const indexEn = casesEn.indexOf(caseStr);
  if (indexEn !== -1) return indexEn;
  return 0; // Fall back to 0 if an invalid case was provided
}

function declineName(name: string, declension: string, caseStr: Case): string {
  const [subtractString, appendicesString] = declension.split(";");

  const subtraction = Number(subtractString);
  const appendices = (appendicesString || "").split(",");
  const caseIndex = getCaseIndex(caseStr);

  // Should not happen, but prefer being safe
  if (!Number.isFinite(subtraction)) return name;
  if (appendices.length !== 4) return name;

  const root = name.substr(0, name.length - subtraction);
  return root + appendices[caseIndex];
}

/**
 * This function can applies one of the following cases to a source name
 * provided in the nominative case (nefnifall).
 *
 * - Nominative `nom` (nefnifall `nf` in Icelandic)
 * - Accusative `acc` (þolfall `þf` in Icelandic)
 * - Dative `dat` (þágufall `þgf` in Icelandic)
 * - Genitive `gen` (eignarfall `ef` in Icelandic)
 *
 * @example
 * ```tsx
 * applyCase("ef", "Jóhann");
 * //=> "Jóhannesar"
 * ```
 *
 * The name provided must be an Icelandic name in the nominative case
 * (nefnifall) or an unexpected output is likely.
 *
 * @param name - An Icelandic name in the nominative case (nefnifall)
 * @param caseStr - The case to apply to the name to, e.g. `þf`
 */
export function applyCase(caseStr: Case, name: string): string {
  const declension = extractDeclension(trie, name);
  if (!declension) return name;
  return declineName(name, declension, caseStr);
}
