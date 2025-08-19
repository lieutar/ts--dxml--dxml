import { clearChildren, type IWindow } from "domlib";
import { DOMProcessor, DOM2DOMProcessor } from 'dom-processor';

const looperTs = (window:IWindow, conv:(src:string)=>string) => DOM2DOMProcessor.withRules( window,
  {
    element: 'link',
    action(n:Node){
      const e = clearChildren(n as Element);
      const url = String(e.getAttribute('url'));
      e.setAttribute('url',url.match(/^ws:/) ? conv(url) : url);
      e.appendChild(this.processChildren(n) as DocumentFragment);
      return e;
    } },
  ... DOM2DOMProcessor.basicRules );


export function builtinPP(window: IWindow): {[key:string]:DOMProcessor}{
  return {
    'looper-ts:github': looperTs(window, (src:string)=>{
      const chopped = src.replace(/^\s*ws:\/|\s+$/g, '');
      const prefix = 'https://github.com/lieutar/';
      if(chopped === '') return prefix + 'looper-ts';
      if(chopped === 'pages/lieutar.github.io') return prefix + 'lieutar.github.io';
      return prefix + 'ts--' + (chopped.replace(/\//g, '--'));
    })
  };
}
