import path from "path";
import fs from "fs";
import { writeAndLogSize } from "../lib/preprocess/utils/gzip";
import assert from "assert";

const addressesToExclude = new Set([
  "Hermes", // For some reason, this name is present in 'icelandic-addresses.csv'
]);

type Keys =
  | "FID"
  | "HNITNUM"
  | "SVFNR"
  | "BYGGD"
  | "LANDNR"
  | "HEINUM"
  | "MATSNR"
  | "POSTNR"
  | "HEITI_NF"
  | "HEITI_TGF"
  | "HUSNR"
  | "BOKST"
  | "VIDSK"
  | "SERHEITI"
  | "DAGS_INN"
  | "DAGS_LEIDR"
  | "GAGNA_EIGN"
  | "TEGHNIT"
  | "YFIRFARID"
  | "YFIRF_HEITI"
  | "ATH"
  | "NAKV_XY"
  | "HNIT"
  | "N_HNIT_WGS84"
  | "E_HNIT_WGS84"
  | "NOTNR"
  | "LM_HEIMILISFANG"
  | "VEF_BIRTING"
  | "HUSMERKING";

const csvFilePath = path.resolve(__dirname, "../data/icelandic-addresses.csv");
const jsonFilePath = path.resolve(__dirname, "../out/icelandic-addresses.json");

function main() {
  const fileContent = fs.readFileSync(csvFilePath, "utf-8");
  const lines = fileContent.split("\n");

  const keys = lines[0].split(",");
  function parse(line: string) {
    const out = {} as Record<Keys, unknown>;
    for (const [i, value] of line.split(",").entries()) {
      out[keys[i] as Keys] = value;
    }
    return out;
  }

  const addresses = new Set<string>();

  for (const line of lines.slice(1)) {
    if (line === "") continue; // File ends with empty line

    const item = parse(line);

    const name = item.HEITI_NF;
    assert(typeof name === "string" && !!name);

    if (name.includes(" ")) continue; // No spaces in address names

    if (addressesToExclude.has(name)) continue;

    addresses.add(name);
  }

  // Ensure that the 'out/' dir exists.
  fs.mkdirSync(path.resolve(__dirname, "../out/"), { recursive: true });

  writeAndLogSize(jsonFilePath, JSON.stringify([...addresses], null, 2));
}

main();
