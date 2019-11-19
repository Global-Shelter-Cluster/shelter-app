// @flow

import type {ObjectRequest} from "../persist";
import type {HtmlString, UrlString} from "./index";

export type KoboFormObject = {
  _last_read?: number,
  _mode: "public",
  _persist?: true,
  id: number,
  groups?: Array<number>,
  title: string,
  description: HtmlString,
  kobo_form_url: UrlString,
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
