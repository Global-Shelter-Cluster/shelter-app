// @flow

import type {ObjectFileDescription, ObjectRequest} from "../persist";
import type {DateString, HtmlString, UrlString} from "./index";

export type PublicDocumentObject = {
  _last_read?: number,
  _mode: "public",
  _persist?: true,
  id: number,
  changed: DateString,
  title: string,
  publisher: number,
  groups: Array<number>,
  date: string,
  file?: UrlString,
  link?: UrlString,
  source: string,
  language: string,
  featured?: true,
  key?: true,
  preview: string,
  description: HtmlString,
}

export type StubDocumentObject = {
  _last_read?: number,
  _mode: "stub",
  _persist?: true,
  id: number,
  changed: DateString,
  title: string,
  date: string,
  preview: string,
}

export type DocumentObject = PublicDocumentObject | StubDocumentObject;

export default class Document {
  static getRelated(document: DocumentObject): Array<ObjectRequest> {
    const ret = [];

    if (document.groups !== undefined)
      ret.push(...document.groups.map(id => ({type: "group", id: id})));

    if (document.publisher !== undefined)
      ret.push({type: "user", id: document.publisher});

    return ret;
  }

  static getFiles(document: DocumentObject): Array<ObjectFileDescription> {
    const files = [];

    if (document.preview !== undefined)
      files.push({type: "document", id: document.id, property: "preview", url: document.preview});

    if (document.file !== undefined)
      files.push({type: "document", id: document.id, property: "file", url: document.file});

    return files;
  }
}
