# Input data

This directory contains the source data that builds upon the trie.

## `icelandic-names.json`

The data for 'icelandic-names.json' is derived from [https://island.is/leit-i-mannanafnaskra](https://island.is/leit-i-mannanafnaskra).


## `word-cases.csv`

The data for `word-cases.csv` is downloaded from [bin.arnastofnun.is](https://bin.arnastofnun.is/gogn/mimisbrunnur/).

The website shares the data under the [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) license.

The `word-cases.csv` file is not tracked in Git because it is very large (~350 MB). You can download it by running the following command:

```
npm run download-words
```