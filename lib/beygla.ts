// This file constitutes the public API for this library

import { deserializeTrie } from "./read/deserialize";
import { extractDeclension } from "./read/extractDeclension";
import serializedInput from "./read/serializedInput";

const trie = deserializeTrie(serializedInput);

const casesIs = ["nf", "þf", "þgf", "ef"] as const;
const casesEn = ["nom", "acc", "dat", "gen"] as const;

type CaseIcelandic = typeof casesIs[number];
type CaseEnglish = typeof casesEn[number];

type Case = CaseIcelandic | CaseEnglish;

function getCaseIndex(caseStr: Case) {
  const indexIs = casesIs.indexOf(caseStr as CaseIcelandic);
  if (indexIs !== -1) return indexIs;
  const indexEn = casesEn.indexOf(caseStr as CaseEnglish);
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

export function applyCase(name: string, caseStr: Case): string {
  const declension = extractDeclension(trie, name);
  if (!declension) return name;
  return declineName(name, declension, caseStr);
}

export function hasDeclension(name: string): boolean {
  const declension = extractDeclension(trie, name);
  return !!declension;
}
