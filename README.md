# sketch-messure-cli

[![Build Status](https://travis-ci.org/devsigners/sketch-measure-cli.svg?branch=master)](https://travis-ci.org/devsigners/sketch-measure-cli)
[![npm version](https://badge.fury.io/js/sketch-measure-cli.svg)](https://badge.fury.io/js/sketch-measure-cli)
[![GitHub stars](https://img.shields.io/github/stars/devsigners/sketch-measure-cli.svg)](https://github.com/devsigners/sketch-measure-cli/stargazers)

[sketch-measure](https://github.com/utom/sketch-measure) is a great plugin for sketch. Sometimes I want to embed it to workflow with cli, and it's really hard.
Neither `sketchtool` nor [`coscript`](https://github.com/marekhrabe/coscript) give the full power to process skech files with sketch-measure.

And finally I write *sketch-messure-cli* to help to use sketch-measure with cli. **Surely it's not exactly the same as sketch-measure plugin.**

## Installation & Usage

```bash
npm i -g sketch-measure-cli
```

and then:

```bash
sketch-measure convert demo.sketch -d destDir
```

*If you don't set dest dir, the tool will use `working-dir/sketch-file-name` instead.*

So you can view measure pages in `destDir`


## Attention

### Text attributes transform

Most attributes of text is encoded as base64 string, and is not ease to parse it. Current only the first part of text's style info is used, others are dropped because cannot get the position info.

### Symbols

Symbol artboards are removed because we cannot get preview image of every single symbol.


## Credits

- [sketch-measure](https://github.com/utom/sketch-measure) to learn how sketch-measure works.
- [react-sketch-viewer](https://github.com/FourwingsY/react-sketch-viewer) to parse text arributes.
