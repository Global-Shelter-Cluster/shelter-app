// @flow

import type {ObjectFileDescription, ObjectRequest} from "../persist";

export type PublicContactObject = {
  _last_read?: number,
  _mode: "public",
  _persist?: true,
  id: number,
  groups?: Array<number>,
  name: string,
  picture?: string,
  org?: string,
  role?: string,
  mail?: Array<string>,
  phone?: Array<string>,
  bio?: string, // HTML
  weight: number,
}

export type StubContactObject = {
  _last_read?: number,
  _mode: "stub",
  _persist?: true,
  id: number,
  name: string,
  picture?: string,
  org?: string,
  role?: string,
  mail?: Array<string>,
  phone?: Array<string>,
  bio?: string, // HTML
  weight: number,
}

export type ContactObject = PublicContactObject | StubContactObject;

export default class Contact {
  static getRelated(contact: ContactObject): Array<ObjectRequest> {
    const ret = [];

    if (contact.groups !== undefined)
      ret.push(...contact.groups.map(id => ({type: "group", id: id})));

    if (contact.user !== undefined)
      ret.push({type: "user", id: contact.user});

    return ret;
  }

  static getFiles(contact: ContactObject): Array<ObjectFileDescription> {
    const files = [];

    if (contact.picture !== undefined)
      files.push({type: "contact", id: contact.id, property: "picture", url: contact.picture});

    return files;
  }
}
