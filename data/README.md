# Input data

This directory contains the source data that builds upon the trie.

## `names.csv`

The data for 'names.csv' is copied from the [Ísland.is GitHub repository](https://github.com/island-is/island.is).

See [IcelandicName.csv](https://github.com/island-is/island.is/blob/e19b56f4d34ad20e0337ae73140a1c71afb9356c/apps/icelandic-names-registry/backend/data/IcelandicName.csv).

The project uses an MIT license. The `LICENSE` text from repository reads as follows:

```
Copyright 2020 Digital Iceland

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

## `words.csv`

The data for `words.csv` is downloaded from [bin.arnastofnun.is](https://bin.arnastofnun.is/gogn/mimisbrunnur/).

The website shares the data under the [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) license.

The `words.csv` file is not tracked in Git because it is very large (~350 MB). You can download it by running the following command:

```
npm run download-words
```