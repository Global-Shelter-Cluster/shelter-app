// @flow

//import type {ObjectRequest} from "../persist";

export type LanguageObject = {
  _last_read?: number,
  _mode: "public",
  _persist?: true,
  language: string,
  name: string,
  native: string, // HTML
  direction: string,
  enabled: string,
  plurals: string,
  formula: string,
  domain: string,
  prefix: string,
  weight: string,
  javascript: string,
}

export default class Language {
  static getRelated() {
    return [];
  }

  static getFiles(): [] {
    return [];
  }
}
