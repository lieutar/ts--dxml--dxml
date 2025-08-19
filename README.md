# dxml

XML for draft.

`dxml` is a simple format and having only following elements: `sec`, `title`, `d`.

Why does this alone qualify as a document format?
Because Markdown can be written in dxml Text Nodes.
So why isn't Markdown sufficient?
Because Markdown doesn't allow for mixing notations in multiple languages
and extracting only the necessary ones.

The optimal solution would be to write a lightweight markup language that extends Markdown and its parser,
but that's not something that can be done immediately.
However, there are existing parsers for XML, and for detailed markup,
borrowing the power of Markdown and running it through an existing Markdown parser
would be the solution that meets this goal with the least amount of effort.

## Installation

Now time, this project is supported for development on my  [workspace](https://github.com/lieutar/looper-ts) , and
this don't provide regular way to install.

## Elements

### `<sec>`

すべての文書の基本的なコンテナ。ルート要素になることができるもの。

`<sec>`はネストすることができ、ネストによりレベルを示すことができる。

ルート要素の `lang` 属性は`<d>`要素のデフォルトの同属性の値となる。

### `<title>`

`<sec>`要素の直下に一つだけ設定されるセクションのタイトル。

### `<d>`

ドラフト要素。

一段階までネストすることができ、`lang`属性によって親`<d>`要素の別言語オルタナティヴを設定できる。

## LICENSE

MIT


