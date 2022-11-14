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
- [Correctness](#Correctness)
  - [Passing a name in the wrong case](Passing_a_name_in_the_wrong_case)
  - [What happens if beygla does not find a pattern?](What_happens_if_beygla_does_not_find_a_pattern)

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

[^*]: Declension rules are encoded using cases for 3647 out of 4505 Icelandic names (81%). The data for the cases is from [bin.arnastofnun.is](https://bin.arnastofnun.is/gogn/).

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

<h2 id="Correctness">
Correctness
</h2>

Beygla will correctly apply the desired case to the input name in most cases.

Most Icelandic names (81%), especially common ones, are present on [bin.arnastofnun.is](https://bin.arnastofnun.is/gogn/). Beygla is guaranteed to produce a correct result for those names.

This does not mean that Beygla produces an incorrect result for the other 19% of names. Beygla finds patterns in name endings based on the data on [bin.arnastofnun.is](https://bin.arnastofnun.is/gogn/) and applies those patterns to any input name. This means that beygla will produce a correct result for most names, even if the name is not in the dataset from [bin.arnastofnun.is](https://bin.arnastofnun.is/gogn/).

I tried randomly sampling 20 names from the list of legal Icelandic names not present in [bin.arnastofnun.is](https://bin.arnastofnun.is/gogn/):

 * 14 names matched a pattern with the correct result
 * 6 names matched no pattern
 * 0 names matched a pattern with an incorrect result

Even though I happened to get no incorrect results, this is a very small sample. I'm absolutely certain that there are a handful of names that will produce incorrect results.

See [beygla.spec.ts](https://github.com/alexharri/beygla/blob/master/lib/beygla.spec.ts).


<h3 id="Passing_a_name_in_the_wrong_case">
Passing a name in the wrong case
</h3>

Beygla operates on the assumption that names provided to it are in the nominative case (nefnifall). If a name provided to beygla is in another case than nominative, an incorrect result is extremely likely.


<h3 id="What_happens_if_beygla_does_not_find_a_pattern">
What happens if beygla does not find a pattern?
</h3>

Given a name that has an ending that beygla does not recognize, it will not apply the case to the name.

Do note that beygla attempts to apply the case to every name (first, last, and middle name) in a full name individually. This means that some names in a full name might have a case applied, and some not.
