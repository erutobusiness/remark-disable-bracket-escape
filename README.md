# remark-disable-bracket-escape

A [remark](https://github.com/remarkjs/remark) plugin to prevent square brackets (`[`) from being escaped by [remark-stringify](https://github.com/remarkjs/remark/tree/main/packages/remark-stringify).

## Problem

By default, `remark-stringify` escapes `[` characters in text nodes to `\[` to avoid ambiguity with link syntax. This can be undesirable when you want to preserve literal brackets in your Markdown output.

## How it works

This plugin uses the **Custom Node Pattern** — it transforms `[` characters in text nodes into custom `bracketLiteral` AST nodes with a dedicated serialization handler. Since `mdast-util-to-markdown` only escapes characters inside `text` nodes, moving `[` into a custom node bypasses the escaping logic entirely.

## Install

```bash
npm install remark-disable-bracket-escape
```

## Usage

```js
import { remark } from "remark";
import remarkDisableBracketEscape from "remark-disable-bracket-escape";

const result = await remark()
  .use(remarkDisableBracketEscape)
  .process("some text with [brackets]");

console.log(String(result));
// => "some text with [brackets]\n"
```

## API

### `remarkDisableBracketEscape`

Plugin — no options. Add it to your remark pipeline and all `[` characters in text nodes will be preserved as-is in the output.

## License

[MIT](LICENSE)
