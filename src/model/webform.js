// @flow

import type {ObjectRequest} from "../persist";

export type WebformObject = {
  _last_read?: number,
  _mode: "public",
  _persist?: true,
  id: number,
  groups?: Array<number>,
  title: string,
  form: Array<WebformPage>,
}

type WebformPage = {
  title?: string,
  fields: Array<WebformField>,
}

type WebformField = WebformTextField | WebformMarkupField;

type WebformTextField = {
  type: "textfield",
  key: string,
  name: string,
  required?: true,
  default?: string,
  description?: string,
}

type WebformMarkupField = {
  type: "markup",
  value: string, // HTML
}

export default class Webform {
  static getRelated(webform: WebformObject): Array<ObjectRequest> {
    const ret = [];

    if (webform.groups !== undefined)
      ret.push(...webform.groups.map(id => ({type: "group", id: id})));

    return ret;
  }

  static getFiles(): [] {
    return [];
  }
}
