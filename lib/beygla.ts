// This file constitutes the public API for this library

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

export function applyCase(name: string, caseStr: Case): string {
  const declension = extractDeclension(trie, name);
  if (!declension) return name;
  return declineName(name, declension, caseStr);
}

export function hasDeclension(name: string): boolean {
  const declension = extractDeclension(trie, name);
  return !!declension;
}
