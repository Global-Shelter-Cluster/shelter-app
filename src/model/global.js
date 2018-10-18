// @flow

import type {ObjectRequest} from "../persist";

export const GLOBAL_OBJECT_ID = 1;

export type GlobalObject = {
  _last_read?: number,
  _mode: "public",
  _persist: true,
  id: 1,
  featured_groups?: Array<number>,
  top_regions?: Array<number>,
  algolia_app_id?: string,
  algolia_search_key?: string,
  algolia_prefix?: string,
  global_id: int,
  resources_id: int,
}

export default class Global {
  static getRelated(global: GlobalObject): Array<ObjectRequest> {
    const ret = [];

    if (global.featured_groups !== undefined)
      ret.push(...global.featured_groups.map(id => ({type: "group", id: id})));
    if (global.top_regions !== undefined)
      ret.push(...global.top_regions.map(id => ({type: "group", id: id})));

    return ret;
  }

  static getFiles(): [] {
    return [];
  }
}
