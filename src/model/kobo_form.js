// @flow

import type {ObjectRequest} from "../persist";

export type KoboFormObject = {
  _last_read?: number,
  _mode: "public",
  _persist?: true,
  id: number,
  groups?: Array<number>,
  title: string,
  description: string, // HTML
  kobo_form_url: string,
}

export default class KoboForm {
  static getRelated(kobo_form: KoboFormObject): Array<ObjectRequest> {
    const ret = [];

    if (kobo_form.groups !== undefined)
      ret.push(...kobo_form.groups.map(id => ({type: "group", id: id})));

    return ret;
  }

  static getFiles(): [] {
    return [];
  }
}
