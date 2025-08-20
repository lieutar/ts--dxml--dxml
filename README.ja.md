# dxml

<img src="https://img.shields.io/badge/-TYPESCRIPT-informational?logo=TypeScript&style=flat&logoColor=1a5fb4&color=1a5fb4&labelColor=f6f5f4" alt="Powerd by TypeScript"><img src="https://img.shields.io/badge/-xml-informational?logo=xml&style=flat&logoColor=26a269&color=26a269&labelColor=f6f5f4" alt="Powerd by XML">

XML for draft.

`dxml` はシンプルなフォーマットで独自の要素としては `sec`, `title`, `d`というものしか持ちません。

これだけで何故文書フォーマットたりえるのか、それは dxml の Text Node に Markdown が書けるためで、
ではなぜ Markdown では駄目なのかと言えば、Markdown では複数の言語による表記を混在させ、
必要に応じたものだけを抜き出すといった処理ができないためです。

最適なのは Markdown をより拡張するような軽量マークアップ言語とそのパーサを書くことですが、
それはすぐに出来るものではありません。しかし、xml ならば既存のパーサがありますし、
細かなマークアップについては、Markdown の力を借り、既存の Markdown パーサに通すという形が、
最も少ない工数でこの目的に叶うソリューションを作りだすものになります。

## Installation

現在、 [ワークスペース](https://github.com/lieutar/looper-ts) 内での開発にのみ対応しており、公式なインストール方法はありません。

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


