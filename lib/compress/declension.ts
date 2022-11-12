import { NO_DECLENSION, NO_DECLENSION_MARKER } from "../common/constants";

export function formatDeclension(names: string[]): string {
  const name = names[0];

  let root = "";
  const minLen = Math.min(...names.map((name) => name.length));

  outer: for (let i = 0; i < minLen; i++) {
    const char = name[i];

    for (const name of names) {
      if (name[i] !== char) {
        break outer;
      }
    }

    root += char;
  }

  const subtract = name.length - root.length;

  if (subtract > 9) {
    // If this limit is reached in the future, update the serializer/deserializer
    // to read 2+ digit numbers.
    throw new Error(
      `Declension subraction for name '${name}' exceeds 9 characters.`
    );
  }

  function getEnding(name: string) {
    return name.substr(root.length);
  }

  const declension = `${subtract};${names
    .map((name) => getEnding(name))
    .join(",")}`;

  if (declension === NO_DECLENSION) return NO_DECLENSION_MARKER;
  return declension;
}
