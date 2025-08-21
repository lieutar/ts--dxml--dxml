import { type IWindow } from "domlib";
import { DOMProcessor, DOM2TextProcessor } from 'dom-processor';
import { ContextStack } from "context-stack";

export function builtinStyles(_window: IWindow): {[key:string]:DOMProcessor}{
  return {
    md: (()=>{
      type MdProcessorContext = {sectionDepth:number, indentDepth:number, ordered: number | null};
      const context = new ContextStack<MdProcessorContext>({initial:{sectionDepth:1, indentDepth:0, ordered: null}});
      return DOM2TextProcessor.withRules(
        {
          element: '/',
          action(n:Node){
            context.init();
            return this.processChildren(n) as string; } },
        {
          element: 'sec',
          action(n:Node){
            return context.withContext((pre)=>(
              {...pre, sectionDepth: pre.sectionDepth + 1}),
              ()=>this.processChildren(n)) as string; } },
        {
          element: 'list',
          action(n:Node){
            //console.log('  '.repeat(context.current.indentDepth) + '>>' , context.current.indentDepth);
            const ordered = (n as Element).getAttribute('ordered') !== 'true' ? null : 1;
            const rs = context.withContext((pre)=>({...pre, ordered, indentDepth: pre.indentDepth+1 }),
              ()=>{
                //console.log('  '.repeat(context.current.indentDepth) + '--' , context.current.indentDepth);
                return this.processChildren(n) as string;
              });
            //console.log('  '.repeat(context.current.indentDepth) + '<<' , context.current.indentDepth);
            return rs; } },
        {
          element: 'title',
          action(n:Node){
            return ('#'.repeat(context.current.sectionDepth) + " " + this.processChildren(n))
              .replace(/^[\s\n]*/,'')
              .replace(/\n*$/, "\n\n"); } },
        {
          element: 'code',
          action(n:Node){
            const lang = (n as Element).getAttribute('lang');
            const begin = '```' + (lang ? ' '+lang : '') + '\n';
            return begin + String(this.processChildren(n)).replace(/\n*$/, "\n") + '```\n';
          } },
        {
          element: 'listItem',
          action(n:Node){
            const bullet = (context.current.ordered === null ? '-' : (context.current.ordered++ + '.')) + " ";
            const fIndent = ' '.repeat(bullet.length + 1);
            const children = String(this.processChildren(n)).replace(/\n*$/, '').replace(/\n/g, '\n'+ fIndent);
            const withoutIndent =  (bullet+" " + children).replace(/\n*$/, "\n\n");

            if( context.current.indentDepth > 1) return withoutIndent;
            return '  ' + withoutIndent.replace(/\n/g, '\n  ').replace(/ +$/,''); }},
        {
          element: 'img',
          action(n:Node){
            const e = n as Element;
            return `<img src="${e.getAttribute('src')}" alt="${e.getAttribute('alt')}">` }
        },
        {
          element: 'link',
          action(n:Node){
            return ' [' + this.processChildren(n) + '](' + (n as Element).getAttribute('url') + ') ' } },
        {
          element: 'inlineCode',
          action(n:Node){ return '`' + this.processChildren(n) + '`'; } },
        {
          element: 'html',
          action(n:Node){ return n.textContent ?? ''; }},
        {
          element: 'paragraph',
          action(n:Node){
            return String(this.processChildren(n)).replace(/^\s*/,'').replace(/\s*$/, '\n\n'); } },
        ... DOM2TextProcessor.basicRules );})(), // end of md
  }
}
