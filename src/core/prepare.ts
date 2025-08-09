import { xmlifyMd } from "./md";

function removeIndent(text: string): string {
    const lines: [string, string][] = text.split("\n").map(line => {
        const match = line.match(/^(\s*)/);
        const indent = match ? match[1] : '';
        return [indent!, line];
    });

    if (lines.length < 1) return text;
    if (lines.length === 1) return lines[0]![1].replace(/^\s+/, '');

    const [firstLineInfo, ...restLinesInfo] = lines;

    const meaningfulIndents = restLinesInfo
        .filter(([, originalLine]) => originalLine.trim().length > 0)
        .map(([indent]) => indent.length)

    let smallestIndentLength =  meaningfulIndents.length > 0
      ? Math.min(...meaningfulIndents) : 0;

  return [
    firstLineInfo![1].replace(/^\s+/, ''),
    ... restLinesInfo.map(([_, originalLine]) => {
      if (originalLine.trim().length === 0) {
        return '';
      }
      return originalLine.substring(smallestIndentLength);
    })].join('\n');
}

function prepareTextNode(tn: Text) : DocumentFragment {
  const doc = tn.ownerDocument;
  const R = doc.createDocumentFragment();
  const text = removeIndent(tn.data);
  if(!text.match(/\S/)){
    R.appendChild(tn.cloneNode());
  }else{
    R.appendChild(xmlifyMd(doc, text));
  }
  return R;
}

export function prepareDxmlElement(elem: Element) : Element{
  const doc = elem.ownerDocument;
  const result = elem.cloneNode() as Element;
  while(result.firstChild) result.removeChild(result.firstChild);
  for( const cn of elem.childNodes ){
    if(cn.nodeType === doc.ELEMENT_NODE){
      result.appendChild(prepareDxmlElement(cn as Element));
    }else if(cn.nodeType === doc.TEXT_NODE){
      result.appendChild(prepareTextNode(cn as Text));
    }else{
      /* ignore */
    }
  }
  return result;
}
