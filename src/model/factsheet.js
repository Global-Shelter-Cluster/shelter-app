// @flow

import type {ObjectFileDescription, ObjectRequest} from "../persist";
import type {HtmlString, UrlString} from "./index";

export type NumberFactsheetKeyFigure = {
  type: "number",
  label: string,
  value: number,
}

export type ChartFactsheetKeyFigure = {
  type: "chart",
  title: string,
  description?: string,
  chart: UrlString,
  smallImage?: true,
}

export type FactsheetKeyFigure = NumberFactsheetKeyFigure | ChartFactsheetKeyFigure;

export type PublicFactsheetObject = {
  _last_read?: number,
  _mode: "public",
  _persist?: true,
  id: number,
  groups: Array<number>,
  date: string, // TODO: proper date?
  image: UrlString,
  full_image?: UrlString,
  prev?: number,
  next?: number,
  highlights: HtmlString,
  photo_credit?: string,
  map?: UrlString,
  full_map?: UrlString,
  need_analysis?: HtmlString,
  response?: HtmlString,
  gaps_challenges?: HtmlString,
  key_dates?: Array<{
    date: string, // not DateString, since the format of this field is free
    description: string,
  }>,
  key_documents?: Array<number>,
  key_links?: Array<{
    url: UrlString,
    title: string,
  }>,
  key_figures?: Array<FactsheetKeyFigure>,
  coverage_against_targets?: {
    description?: string,
    chart?: UrlString,
  },
}

export type StubFactsheetObject = {
  _last_read?: number,
  _mode: "stub",
  _persist?: true,
  id: number,
  date: string, // TODO: proper date?
  image: UrlString,
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
