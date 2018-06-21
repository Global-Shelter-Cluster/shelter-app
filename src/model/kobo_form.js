// @flow

import type {ObjectFileDescription, ObjectRequest} from "../persist";
import {createSelector} from 'reselect';

export type PrivateKoboFormObject = {
  _last_read?: number,
  _mode: "private",
  _persist?: true,
  id: number,
  title: string,
  description: string,
  kobo_form_url: string,
  groups?: Array<number>,
}

export type PublicKoboFormObject = {
  _last_read?: number,
  _mode: "public",
  _persist?: true,
  id: number,
  title: string,
  description: string,
  groups?: Array<number>,
}

export type StubKoboFormObject = {
  _last_read?: number,
  _mode: "stub",
  _persist?: true,
  id: number,
  title: string,
  descirption: string,
}

export type KoboFormObject = PrivateKoboFormObject | PublicKoboFormObject | StubKoboFormObject;

export default class KoboForm {
  static getRelated(kobo_form: KoboFormObject): Array<ObjectRequest> {
    const ret = [];

    if (kobo_form.groups !== undefined)
      ret.push(...kobo_form.groups.map(id => ({type: "group", id: id})));

    return ret;
  }

  static getFiles(kobo_form: KoboFormObject): Array<ObjectFileDescription> {
    return [];
  }
}
