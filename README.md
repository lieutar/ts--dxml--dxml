# dxml

<img src="https://img.shields.io/badge/-TYPESCRIPT-informational?logo=TypeScript&style=flat&logoColor=1a5fb4&color=1a5fb4&labelColor=f6f5f4" alt="Powerd by TypeScript"><img src="https://img.shields.io/badge/-xml-informational?logo=xml&style=flat&logoColor=26a269&color=26a269&labelColor=f6f5f4" alt="Powerd by XML">

XML for draft.

`dxml` is a simple format and having only following unique elements: `sec`, `title`, `d`.

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

### Unique Elements

#### `<sec>`

すべての文書の基本的なコンテナ。ルート要素になることができるもの。

`<sec>`はネストすることができ、ネストによりレベルを示すことができる。

ルート要素の `lang` 属性は`<d>`要素のデフォルトの同属性の値となる。

#### `<title>`

`<sec>`要素の直下に一つだけ設定されるセクションのタイトル。

#### `<d>`

ドラフト要素。

一段階までネストすることができ、`lang`属性によって親`<d>`要素の別言語オルタナティヴを設定できる。

### HTML Elements

[GFM](https://github.github.com/gfm/)  では HTML 要素を入れ込むことができますが、dxml で入れ込むときは、
XML 要素として書きます。

このとき、名前空間はデフォルトのもので構いません。(むしろ名前空間を厳格に扱ってはいません)

### Markdown Elements

TextNode は Markdown ですが、dxml パーサは `[remark](https://github.com/remarkjs/remark)` を通し
POJO AST 化したものを、機械的に XML に変換します。

その為それによって生成され得る要素は dxml 内に直接書くことができます。たとえば以下のようにです。

``` xml
<paragraph>
<img src="..." alt=".." />
</paragraph>
This is new paraguraph.
```
これは殆どの場合には不要なテクニックですが、この例のように
HTML 要素に続くパラグラフを別のものとして扱いたい場合などに使えます。

## LICENSE

MIT


