// @flow

import type {ObjectRequest} from "../persist";

export const GLOBAL_OBJECT_ID = 1;

export type GlobalObject = {
  _last_read?: number,
  _mode: "public",
  _persist: true,
  id: 1,
  featured_groups: Array<number>,
}

export default class Global {
  static getRelated(global: GlobalObject): Array<ObjectRequest> {
    const ret = [];

    ret.push(...global.featured_groups.map(id => ({type: "group", id: id})));

    return ret;
  }

  static getFiles(): [] {
    return [];
  }
}
