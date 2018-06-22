// @flow

import type {ObjectFileDescription, ObjectRequest} from "../persist";

export type PublicFactsheetObject = {
  _last_read?: number,
  _mode: "public",
  _persist?: true,
  id: number,
  groups: Array<number>,
  date: string, // TODO: proper date?
  image: string,
  full_image?: string,
  prev?: number,
  next?: number,
  highlights: string, // HTML
  photo_credit?: string,
  map?: string,
  full_map?: string,
  need_analysis?: string, // HTML
  response?: string, // HTML
  gaps_challenges?: string, // HTML
  key_dates?: Array<{
    date: string,
    description: string,
  }>,
  key_documents?: Array<number>,
  key_links?: Array<{
    url: string,
    title: string,
  }>,
}

export type StubFactsheetObject = {
  _last_read?: number,
  _mode: "stub",
  _persist?: true,
  id: number,
  date: string, // TODO: proper date?
  image: string,
}

export type FactsheetObject = PublicFactsheetObject | StubFactsheetObject;

export default class Factsheet {
  static getRelated(factsheet: FactsheetObject): Array<ObjectRequest> {
    const ret = [];

    if (factsheet.groups !== undefined)
      ret.push(...factsheet.groups.map(id => ({type: "group", id: id})));

    if (factsheet.prev !== undefined)
      ret.push({type: "factsheet", id: factsheet.prev});

    if (factsheet.next !== undefined)
      ret.push({type: "factsheet", id: factsheet.next});

    return ret;
  }

  static getFiles(factsheet: FactsheetObject): Array<ObjectFileDescription> {
    const files = [{type: "factsheet", id: factsheet.id, property: "image", url: factsheet.image}];

    if (factsheet.map !== undefined)
      files.push({type: "factsheet", id: factsheet.id, property: "map", url: factsheet.map});

    return files;
  }
}
