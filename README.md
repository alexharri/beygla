<h1 align="center">
  Beygla
</h1>

<p align="center">
  Tiny (5kB gzipped) declension helper for Icelandic names
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/beygla" target="_blank">
    <img src="https://img.shields.io/npm/v/beygla.svg?style=flat" />
  </a>
  <a href="https://github.com/alexharri/beygla/actions/workflows/publish.yml" target="_blank">
    <img src="https://img.shields.io/github/workflow/status/alexharri/beygla/Publish%20to%20npm" />
  </a>
  <a href="https://bundlephobia.com/package/beygla" target="_blank">
    <img src="https://img.shields.io/bundlephobia/minzip/beygla?label=Size%20%28gzip%29" />
  </a>
  <a href="https://github.com/alexharri/beygla/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/alexharri/beygla" />
  </a>
</p>

```tsx
applyCase("ef", "Jóhann");
//=> "Jóhannesar"

applyCase("þgf", "Helga Fríða Smáradóttir");
//=> "Helgu Fríðu Smáradóttur"
```

---

# Overview

- [Why does beygla exist?](#Why_does_beygla_exist)
- [Usage](#Usage)
  - [Cases](#Cases)
  - [Whitespace](#Whitespace)

---

<h2 id="Why_does_beygla_exist">
Why does beygla exist?
</h2>

Icelandic names have four cases:

```
Guðmundur   →  Nominative case (nefnifall)
Guðmund     →  Accusative case (þolfall)
Guðmundi    →  Dative case (þágufall)
Guðmundar   →  Genitive case (eignarfall)
```

The different cases are used depending on the context in which the name is used.

- _„Hann Guðmundur hefur bætt sig mikið.“_
- _„Illa er farið með góðann Guðmund.“_
- _„Hvað finnst Guðmundi um breytingarnar?“_
- _„Ég kem þessu áleiðis til Guðmundar.“_

Icelandic usernames are stored in the nominative case (nefnifall). This can pose a challenge when using the name in a sentence.

> _The document has been sent to Guðmundur_

Translated to Icelandic, this reads:

> _Skjalið hefur verið sent á Guðmundur_

To an Icelander, this is jarring. The name appears in the nominative case „Guðmundur“, but it should be in the accusative case _„Guðmund“_.

Rewritten to use the nominative case, we get:

> _Guðmundur hefur fengið skjalið sent_

But we've now changed the message entirely!

<table>
<tr><td>Before</td><td>After</td></tr>
<tr>
<td>

> _The document has been sent to Guðmundur_
</td>
<td>

> _Guðmundur has received the document_
</td>
</tr>
</table>

This forces an Icelandic content writer to degrade the user experience by either

 * using language that is not as natural, or
 * reducing specificity by omitting the name entirely.

By being able to decline (transform) names to the correct case, we would remove this problem entirely.

Unfortunately, Icelandic name declension has lots of rules, with **lots** of exceptions.

```
# Left is nominative case, right is accusative case

Gauti → Gauta
Jóhanna → Jóhönnu
Snæfríður → Snæfríði
Alex → Alex
Bjarnfreður → Bjarnfreð
```

Encoding these rules, and their exceptions, is hard and can take up a lot of space. Developers don't want to add hundreds of kilobytes to the bundle size, just to apply cases to names.

Well, beygla encodes these rules in just **5 kilobytes** gzipped.[^*]

[^*]: Declension rules are encoded using 3647 out of 4505 legal Icelandic names (81%). Declension rules are based on data from [bin.arnastofnun.is](https://bin.arnastofnun.is/gogn/).

<h2 id="Usage">
Usage
</h2>

Install beygla as an npm package:

```bash
npm i -S beygla
```

Beygla exports a single function named `applyCase`.

```tsx
import { applyCase } from "beygla";

applyCase("ef", "Jóhann");
//=> "Jóhannesar"

applyCase("þgf", "Helga Dís Smáradóttir");
//=> "Helgu Dís Smáradóttur"
```

`applyCase` accepts two parameters: a case and a name (in the nominative case[^nom]).

The return value is a string with the name declined to the desired case.

[^nom]: If the provided name is not in the nominative case, applyCase is likely to yield an unexpected value.

<h3 id="Cases">
Cases
</h3>

The following cases may be provided as the first argument to `applyCase`:

| Case (English) |  Case (Icelandic) | Value (English) | Value (Icelandic) |
| -------------- | ----------------- | --------------- | ----------------- |
| Nominative     | Nefnifall         | `"nom"`         | `"nf"`            |
| Accusative     | Þolfall           | `"acc"`         | `"þf"`            |
| Dative         | Þágufall          | `"dat"`         | `"þgf"`           |
| Genitive       | Eignarfall        | `"gen"`         | `"ef"`            |

If a case not in the table above is provided, `"nf"` is used as a fallback (i.e. nothing is done).

<h3 id="Whitespace">
Whitespace
</h2>

If the name includes superfluous whitespace, `applyCase` removes it.

```tsx
applyCase("þgf", "  \n  Helga  Dís\tSmáradóttir  \n\n");
//=> "Helgu Dís Smáradóttur"
```
