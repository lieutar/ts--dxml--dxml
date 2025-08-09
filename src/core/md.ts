import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';

export function parseMarkdownToAst(markdownText: string) {
  const file = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .parse(markdownText);
  return file;
}

type AstNodeType = {type: string, children?: AstNodeType[], value?: string, [key:string]:unknown};
export function ast2dom(doc:Document, node: AstNodeType):Node{
  const ns   = doc.documentElement.namespaceURI as string;
  const type = node.type;
  if(type === 'text') return doc.createTextNode(String(node.value));
  const R = doc.createElementNS(ns, type);
  for(const [key, value] of Object.entries(node)){
    if(key === 'type' || key === 'children' || key === 'position') continue;
    if(key === 'value' ){
      R.appendChild(doc.createTextNode(String(value)));
    }else{
      R.setAttribute(key, String(value));
    }
  }
  for(const c of node.children ?? []) R.appendChild(ast2dom(doc, c));
  return R;
}

export function xmlifyMd(doc:Document, text: string):DocumentFragment{
  const R = doc.createDocumentFragment();
  const root = ast2dom(doc, parseMarkdownToAst(text) as AstNodeType);
  for(const node of root.childNodes) R.appendChild(node);
  return R;
}
