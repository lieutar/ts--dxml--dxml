import { isDocumentNode, isElementNode, newDocument, serializeDom, xmldomFromFile, type IWindow } from 'domlib';
import { trimDraft } from './trimDraft';
import { prepareDxmlElement } from './prepare';

import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as  E from 'fp-ts/Either';
import { isFile, readFile } from '@looper-utils/fs';
import { xmlifyMd } from './md';
import { DOMProcessor } from 'dom-processor';
import { builtinPP, builtinStyles } from '@src/builtin';

export type LangType = 'en' | 'ja';

const getFirstChildElement = (node: DocumentFragment): E.Either<Error, Element> =>
  isElementNode(node.firstChild)
    ? E.right(node.firstChild)
    : E.left(new Error('No first child element found in trimmed draft.'));


type processDxmlParams = {
  lang?: LangType, window: IWindow, asText?: boolean,
  pp?: string | DOMProcessor,
  style?: string | DOMProcessor
} & ({file: string} | {doc: Document});
export function processDxml(params: processDxmlParams & {asText: true}): TE.TaskEither<Error, string>;
export function processDxml(params: processDxmlParams & {asText?: false}): TE.TaskEither<Error, Document>;
export function processDxml(params: processDxmlParams): TE.TaskEither<Error, Document|string>  {
  const window = params.window;
  return pipe(
    TE.tryCatch(
      () => {
        if('string' === typeof (params as any).file){
          return xmldomFromFile(window, (params as any).file); }
        return Promise.resolve((params as any).doc as Document);
      },
      (reason) => new Error(`Failed to read or parse XML file: ${String(reason)}`)
    ),
    TE.map(d => d.documentElement),
    TE.map(prepareDxmlElement),
    TE.map((e) => trimDraft(e, params.lang ?? 'en')),
    TE.chainW(e => TE.fromEither(getFirstChildElement(e))),
    TE.map((e) => newDocument(window, e)),
    TE.map((d) => {
      const pparg = params.pp;
      if(!pparg) return d;
      const dp = (()=>{
        if( pparg instanceof DOMProcessor ) return pparg;
        const builtin = builtinPP(window);
        if(builtin[pparg]) return builtin[pparg] as DOMProcessor;
        throw new Error(`Unknown pre-processor '${pparg}'`);
      })();
      const doc = dp.process(d) as Document;
      return doc;
    }),
    TE.map((d) => {
      const style = params.style;
      if(!style) return serializeDom(window, d);
      const dp = (()=>{
        if(style instanceof DOMProcessor) return style;
        const builtin = builtinStyles(window);
        if(builtin[style]) return builtin[style] as DOMProcessor;
        throw new Error(`Unknown style: '${style}'.`);
      })();
      const rs = dp.process(d);
      if('string' === typeof rs){
        if(params.asText) return rs;
        throw new Error();
      }
      if(isDocumentNode(rs)){
        if(params.asText) return serializeDom(window, rs);
        return rs;
      }
      throw new Error();
    }),
  );
}

type processMdParams =  {window: IWindow, file: string};
export function processMd(params: processMdParams): TE.TaskEither<Error, Document > {
  const window = params.window;
  return pipe(
    TE.tryCatch(
      async () => {
        const doc = window.document;
        const file = params.file
        if(!await isFile(file)) throw new Error(`'${file}' isn't a file.`);
        const content = (await readFile(file)).toString();
        const frgn = xmlifyMd(doc, content);
        const elem = doc.createElement('md-doc');
        elem.appendChild(frgn);
        return elem;
      },
      (reason) => new Error(`Failed to read or parse XML file: ${String(reason)}`)
    ),
    TE.map((e) => newDocument(window, e)),
  );
}
