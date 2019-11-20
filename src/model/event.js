// @flow

import type {ObjectFileDescription, ObjectRequest} from "../persist";
import type {HtmlString} from "./index";

export type PublicEventObject = {
  _last_read?: number,
  _mode: "public",
  _persist?: true,
  id: number,
  //changed: DateString,
  title: string,
  groups: Array<number>,
  date: string,
  map: string,
  description: HtmlString,
  address: HtmlString,
  geo: { lon: number, lat: number, zoom: number },
}

export type StubEventObject = {
  _last_read?: number,
  _mode: "stub",
  _persist?: true,
  id: number,
  //changed: DateString,
  title: string,
  date: string,
  map: string,
}

export type EventObject = PublicEventObject | StubEventObject;

export default class Event {
  static getRelated(event: EventObject): Array<ObjectRequest> {
    const ret = [];

    if (event.groups !== undefined)
      ret.push(...event.groups.map(id => ({type: "group", id: id})));

    return ret;
  }

  static getFiles(event: EventObject): Array<ObjectFileDescription> {
    const files = [];

    if (event.map)
      files.push({type: "event", id: event.id, property: "map", url: event.map});

    return files;
  }
}
