// @flow

import type {ObjectFileDescription, ObjectRequest} from "../persist";

export type PublicDocumentObject = {
  _last_read?: number,
  _mode: "public",
  _persist?: true,
  id: number,
  changed: string, // date
  title: string,
  publisher: number,
  groups: Array<number>,
  date: string,
  file?: string,
  link?: string,
  source: string,
  language: string,
  featured?: true,
  key?: true,
  preview: string,
  description: string, // HTML
}

export type StubDocumentObject = {
  _last_read?: number,
  _mode: "stub",
  _persist?: true,
  id: number,
  changed: string, // date
  title: string,
  publisher: number,
  groups: Array<number>,
  date: string,
  preview: string,
}

export type DocumentObject = PublicDocumentObject | StubDocumentObject;

export default class Document {
  static getRelated(document: DocumentObject): Array<ObjectRequest> {
    const ret = [];

    ret.push(...document.groups.map(id => ({type: "group", id: id})));

    if (document.publisher)
      ret.push({type: "user", id: document.publisher});

    return ret;
  }

  static getFiles(document: DocumentObject): Array<ObjectFileDescription> {
    const files = [];

    if (document.preview)
      files.push({type: "document", id: document.id, property: "preview", url: document.preview});

    if (document.file !== undefined && document.file)
      files.push({type: "document", id: document.id, property: "file", url: document.file});

    return files;
  }
}
