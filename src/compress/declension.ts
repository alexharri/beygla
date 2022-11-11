export const NO_DECLENSION = "0;,,,";
export const NO_DECLENSION_MARKER = "~";

export function formatDeclension(names: string[]): string {
  let root = "";

  const minLen = Math.min(...names.map((name) => name.length));

  outer: for (let i = 0; i < minLen; i++) {
    const char = names[0][i];

    for (const name of names) {
      if (name[i] !== char) {
        break outer;
      }
    }

    root += char;
  }

  const subtract = names[0].length - root.length;

  function getEnding(name: string) {
    return name.substr(root.length);
  }

  const declension = `${subtract};${names
    .map((name) => getEnding(name))
    .join(",")}`;

  if (declension === NO_DECLENSION) return NO_DECLENSION_MARKER;
  return declension;
}
