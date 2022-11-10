export function formatEnding(names: string[]) {
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

  return `${subtract};${names.map((name) => getEnding(name)).join(",")}`;
}
