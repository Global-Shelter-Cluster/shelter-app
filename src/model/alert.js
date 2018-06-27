// @flow

import type {ObjectRequest} from "../persist";
import {createSelector} from 'reselect';

export type AlertObject = {
  _last_read?: number,
  _mode: "public",
  _persist?: true,
  id: number,
  created: string, // date
  groups?: Array<number>,
  title: string,
  description?: string, // HTML
  document?: int,
  event?: int,
  factsheet?: int,
  kobo_form?: int,
  group?: int,
  url?: string,
}

export default class Alert {
  static getRelated(alert: AlertObject): Array<ObjectRequest> {
    const ret = [];

    if (alert.groups !== undefined)
      ret.push(...alert.groups.map(id => ({type: "group", id: id})));

    [
      'document',
      'event',
      'factsheet',
      'kobo_form',
      'group',
    ].map(key => {
      if (alert[key] !== undefined)
        ret.push({type: key, id: alert[key]});
    });

    return ret;
  }

  static getFiles(): [] {
    return [];
  }
}
