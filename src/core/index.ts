import { trimDraft } from './trimDraft';
import { isElementNode, newDocument, xmldomFromFile, type IWindow } from 'domlib';
import { prepareDxmlElement } from './prepare';

import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as  E from 'fp-ts/Either';
import { isFile, readFile } from '@looper-utils/fs';
import { xmlifyMd } from './md';

export type LangType = 'en' | 'ja';

const getFirstChildElement = (node: DocumentFragment): E.Either<Error, Element> =>
  isElementNode(node.firstChild)
    ? E.right(node.firstChild)
    : E.left(new Error('No first child element found in trimmed draft.'));


type processDxmlParams = {lang?: LangType, window: IWindow} & ({file: string} | {doc: Document});
export function processDxml(params: processDxmlParams): TE.TaskEither<Error, Document>  {
  const window = params.window;
  return pipe(
    TE.tryCatch(
      () => {
        if('string' === typeof (params as any).file)
          return xmldomFromFile(window, (params as any).file);
        return Promise.resolve((params as any).doc as Document);
      },
      (reason) => new Error(`Failed to read or parse XML file: ${String(reason)}`)
    ),
    TE.map(d => d.documentElement),
    TE.map(prepareDxmlElement),
    TE.map((e) => trimDraft(e, params.lang ?? 'en')),
    TE.chainW(e => TE.fromEither(getFirstChildElement(e))),
    TE.map((e) => newDocument(window, e)),
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
