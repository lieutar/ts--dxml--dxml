import { convertElement } from "domlib";

export function trimDraft(elem: Element, targetLang: string) : DocumentFragment{
  const doc = elem.ownerDocument;
  const R = doc.createDocumentFragment();
  if(elem.tagName !== 'd'){
    R.appendChild(convertElement(elem, (c:Node):Node => {
      if(c.nodeType !== doc.ELEMENT_NODE) return c.cloneNode();
      return trimDraft( c as Element, targetLang);
    }));
  }else{
    const defaultLang = doc.documentElement.getAttribute('lang') ?? 'ja';
    const dElems: {[lang:string] : Node} = {};
    const dLang = elem.getAttribute('lang') ?? defaultLang;
    const conv = (node: Node) : Node => {
      if(node.nodeType !== doc.ELEMENT_NODE){
        return node.cloneNode();
      }else if((node as Element).tagName === 'd') {
        const lang = (node as Element).getAttribute('lang') ?? defaultLang;
        const frgn = doc.createDocumentFragment();
        for(const c of (node as Element).childNodes){
          frgn.appendChild(conv(c));
        }
        dElems[lang] = frgn;
        return doc.createDocumentFragment();
      }else{
        return convertElement(node as Element, conv);
      }
    }
    conv(elem);
    R.appendChild((dElems[targetLang] ?? dElems[dLang])!);
  }
  return R;
}
