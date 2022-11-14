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

const namesThatEndWithSon = ["Samson", "Jason"];

function applyCaseToName(caseStr: Case, name: string) {
  let postfix: [string, string] | null = null;

  for (const [ending, declension] of [
    ["son", "2;on,on,yni,onar"],
    ["dóttir", "2;ir,ur,ur,ur"],
  ]) {
    if (!name.endsWith(ending)) continue;
    if (namesThatEndWithSon.indexOf(name) !== -1) continue;
    postfix = [ending, declension];
    name = name.split(ending)[0];
  }

  if (!postfix) {
    const declension = extractDeclension(trie, name);
    if (declension) name = declineName(name, declension, caseStr);
  } else {
    name += declineName(postfix[0], postfix[1], caseStr);
  }

  return name;
}

/**
 * Applies a case to a source name provided in the nominative
 * case (nefnifall).
 *
 * @example
 * ```tsx
 * applyCase("ef", "Jóhann");
 * //=> "Jóhannesar"
 *
 * applyCase("þgf", "Helga Fríða Smáradóttir");
 * //=> "Helgu Fríðu Smáradóttur"
 * ```
 *
 * The name provided must be an Icelandic name in the nominative case
 * (nefnifall). Otherwise, an unexpected output is likely.
 *
 * The supported cases are:
 *
 * - Nominative `nom` (nefnifall `nf` in Icelandic)
 * - Accusative `acc` (þolfall `þf` in Icelandic)
 * - Dative `dat` (þágufall `þgf` in Icelandic)
 * - Genitive `gen` (eignarfall `ef` in Icelandic)
 *
 * Note that superfluous whitespace is not retained:
 *
 * @example
 * ```tsx
 * applyCase("þf", "  \n  Hildigerður  Oddný\tPatreksdóttir  \n\n");
 * //=> "Hildigerði Oddnýju Patreksdóttur"
 * ```
 *
 * @param name - An Icelandic name in the nominative case (nefnifall)
 * @param caseStr - The case to apply to the name to, e.g. `þf`
 */
export function applyCase(caseStr: Case, name: string): string {
  const names = name.split(/\s+/).filter(Boolean);
  return names.map((name) => applyCaseToName(caseStr, name)).join(" ");
}

export function getDeclensionForName(name: string): string | null {
  if (name.split(/\s+/).length > 1)
    throw new Error("Name must not include whitespace");
  return extractDeclension(trie, name);
}
