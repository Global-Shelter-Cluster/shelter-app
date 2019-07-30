// @flow

import type {ObjectFileDescription, ObjectRequest} from "../persist";
import {html2text} from "../util";
import * as Contacts from 'expo-contacts';

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

export function createExpoContact(contact: ContactObject): Contacts.Contact {
  const f = Contacts.Fields;
  const ret = {
    [f.FirstName]: contact.name,
  };

  if (contact.org !== undefined)
    ret[f.Company] = contact.org;

  if (contact.role !== undefined)
    ret[f.JobTitle] = contact.role;

  if (contact.mail !== undefined)
    ret[f.Emails] = contact.mail.map(email => ({email}));

  if (contact.phone !== undefined)
    ret[f.PhoneNumbers] = contact.phone.map(number => ({number}));

  if (contact.picture !== undefined && contact.picture.startsWith("file://"))
  // Only works with local files
    ret[f.Image] = {uri: contact.picture};

  if (contact.bio !== undefined)
    ret[f.Note] = html2text(contact.bio);

  return ret;
}

export function contactFromAlgoliaResult(item: {}): StubContactObject {
  const stripTags = string => string.replace(/<[^>]*>/g, '');

  const ret = {
    _mode: "stub",
    id: parseInt(item.objectID, 10),
    name: stripTags(item._highlightResult.title.value),
  };

  if (item['field_image:file:url'])
    ret.picture = item['field_image:file:url'];

  if (item._highlightResult.field_organisation_name)
    ret.org = item._highlightResult.field_organisation_name.map(data => stripTags(data.value));

  if (item._highlightResult.field_role_or_title)
    ret.role = item._highlightResult.field_role_or_title.map(data => stripTags(data.value));

  if (item._highlightResult.field_email)
    ret.mail = item._highlightResult.field_email.map(data => stripTags(data.value));

  if (item._highlightResult.field_phone_number)
    ret.phone = item._highlightResult.field_phone_number.map(data => stripTags(data.value));

  if (item._highlightResult['body:value'])
    ret.bio = item._highlightResult['body:value'].map(data => stripTags(data.value));

  return ret;
}
