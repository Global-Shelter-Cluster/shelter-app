// @flow

import type {ObjectFileDescription, ObjectRequest} from "../persist";

export type PublicFactsheetObject = {
  _last_read?: number,
  _mode: "public",
  _persist?: true,
  id: number,
  date: string, // TODO: proper date?
  highlights: string, // HTML
  image: string,
  photo_credit: string,
  map: string,
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
    // TODO: should we have a reference to the group?
    return [];
  }

  static getFiles(factsheet: FactsheetObject): Array<ObjectFileDescription> {
    const files = [{type: "factsheet", id: factsheet.id, property: "image", url: factsheet.image}];

    if (factsheet.map !== undefined)
      files.push({type: "factsheet", id: factsheet.id, property: "map", url: factsheet.map});

    return files;
  }
}
