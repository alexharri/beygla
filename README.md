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

## Why does beygla exist?

Icelandic names have four cases:

```
Guðmundur   →  Nominative case (nefnifall)
Guðmund     →  Accusative case (þolfall)
Guðmundi    →  Dative case (þágufall)
Guðmundar   →  Genitive case (eignarfall)
```

The different cases are used depending on the context in which the name is used.

- „Hann **Guðmundur** hefur bætt sig mikið.“
- „Illa er farið með góðann **Guðmund**.“
- „Hvað finnst **Guðmundi** um breytingarnar?“
- „Ég kem þessu áleiðis til **Guðmundar**.“

Usernames in Icelandic are typically stored in the nominative case (nefnifall). This creates a challenge when writing text referring to a user's name. A simple message like:

> The document has been sent to Guðmundur

Would be translated to:

> Skjalið hefur verið sent á Guðmundur

But to an Icelandic reader, this is jarring because the nominative case is used instead of the accusative case. This message should read:

> Skjalið hefur verið sent á *Guðmund*

Since usernames are stored in the nominative case, we can solve this by **rewriting the entire message** to use the nominative case.

> Guðmundur hefur fengið skjalið sent

But we've now changed the message from:

> Before: *The document has been sent to Guðmundur*
>
> After: *Guðmundur has received the document*

But these sorts of changes can change the tone of voice, and meaning, of the message. This makes the job of content writers significantly harder.

The best way to solve this would be to apply the correct case **to the name** instead of the message. However, Icelandic name declension has lots of rules, with **lots** of exceptions.

```
# Left is nominative case, right is accusative case

Gauti → Gauta
Jóhanna → Jóhönnu
Snæfríður → Snæfríði
Alex → Alex
Bjarnfreður → Bjarnfreð
```

Encoding these rules, and their exceptions, is hard and can take up a lot of space. Developers don't want to add hundreds of kilobytes to the bundle size, just to apply cases to names.

Well, beygla encodes these rules and does it in **5 kilobytes** (gzipped).

[^*]: Beygla encodes declension rules for 3647 out of 4505 legal Icelandic names (81%). Declension rules are based on data from [bin.arnastofnun.is](https://bin.arnastofnun.is/gogn/).
