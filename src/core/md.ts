import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';

export function parseMarkdownToAst(markdownText: string) {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .parse(markdownText);
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

  //if(type === 'list') console.log('>>>>', JSON.stringify(node));

  for(const c of node.children ?? []){
    //if(type === 'list') console.log('-->', JSON.stringify(c));
    R.appendChild(ast2dom(doc, c));
  }

  return R;
}

export function xmlifyMd(doc:Document, text: string):DocumentFragment{
  const R = doc.createDocumentFragment();
  const ast = parseMarkdownToAst(text) as AstNodeType;
  const root = ast2dom(doc, ast);
  let node = root.firstChild;
  while(node){
    const next = node.nextSibling;
    R.appendChild(node);
    node = next;
  }
  return R;
}
