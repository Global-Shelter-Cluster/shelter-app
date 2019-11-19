// @flow

import type {ObjectFileDescription, ObjectRequest} from "../persist";
import createCachedSelector from 're-reselect';
import type {UserObject} from "./user";
import User from "./user";
import type {GroupObject} from "./group";
import Group from "./group";
import type {FactsheetObject} from "./factsheet";
import Factsheet from "./factsheet";
import type {GlobalObject} from "./global";
import Global from "./global";
import type {DocumentObject} from "./document";
import Document from "./document";
import type {EventObject} from "./event";
import Event from "./event";
import type {KoboFormObject} from "./kobo_form";
import KoboForm from "./kobo_form";
import type {WebformObject} from "./webform";
import Webform from "./webform";
import type {AlertObject} from "./alert";
import Alert from "./alert";
import type {NewsObject} from "./news";
import News from "./news";
import type {ContactObject} from "./contact";
import Contact from "./contact";
import type {PageObject} from "./page";
import Page from "./page";
import {createSelector} from "reselect";

export type ObjectType =
  "global"
  | "group"
  | "user"
  | "document"
  | "event"
  | "factsheet"
  | "kobo_form"
  | "webform"
  | "alert"
  | "news"
  | "contact"
  | "page";

export type Objects = {
  global?: { [id: string]: GlobalObject },
  user?: { [id: string]: UserObject },
  group?: { [id: string]: GroupObject },
  factsheet?: { [id: string]: FactsheetObject },
  document?: { [id: string]: DocumentObject },
  event?: { [id: string]: EventObject },
  kobo_form?: { [id: string]: KoboFormObject },
  webform?: { [id: string]: WebformObject },
  alert?: { [id: string]: AlertObject },
  news?: { [id: string]: NewsObject },
  contact?: { [id: string]: ContactObject },
  page?: { [id: string]: PageObject },
}

export type ObjectIds = {
  global?: Array<number>,
  user?: Array<number>,
  group?: Array<number>,
  factsheet?: Array<number>,
  document?: Array<number>,
  event?: Array<number>,
  kobo_form?: Array<number>,
  webform?: Array<number>,
  alert?: Array<number>,
  news?: Array<number>,
  contact?: Array<number>,
  page?: Array<number>,
}

const hour = 3600;

export type HtmlString = string;
export type UrlString = string;
export type DateString = string;

export const expirationLimitsByObjectType = {
  "global": hour * 24 * 7,
  "user": hour * 24 * 7,
  "group": hour,
  "factsheet": hour * 24,
  "document": hour * 24,
  "event": hour * 24,
  "kobo_form": hour * 6,
  "webform": hour * 6,
  "alert": hour * 24,
  "news": hour * 24,
  "contact": hour * 24,
  "page": hour * 24,
};

export type Object =
  GlobalObject
  | UserObject
  | GroupObject
  | FactsheetObject
  | DocumentObject
  | EventObject
  | KoboFormObject
  | WebformObject
  | AlertObject
  | NewsObject
  | ContactObject
  | PageObject;

export const initialObjectsState: Objects = {
  global: {
    '1': {
      _mode: "public",
      _persist: true,
      id: 1,
      featured_groups: [],
    },
  },
  user: {},
  group: {},
  factsheet: {},
  document: {},
  event: {},
  kobo_form: {},
  webform: {},
  alert: {},
  news: {},
  contact: {},
  page: {},
};

export const initialObjectIdsState: ObjectIds = {
  global: [],
  user: [],
  group: [],
  factsheet: [],
  document: [],
  event: [],
  kobo_form: [],
  webform: [],
  alert: [],
  news: [],
  contact: [],
  page: [],
};

const mapTypesToClasses = {
  'global': Global,
  'user': User,
  'group': Group,
  'factsheet': Factsheet,
  'document': Document,
  'event': Event,
  'kobo_form': KoboForm,
  'webform': Webform,
  'alert': Alert,
  'news': News,
  'contact': Contact,
  'page': Page,
};

// Highest level of detail, e.g. a user object includes the list of followed groups.
export const OBJECT_MODE_PRIVATE = 'private';
// Complete object, as seen by anonymous users.
export const OBJECT_MODE_PUBLIC = 'public';
// Simplified object with some extra fields (see STUB). This should rarely be used.
export const OBJECT_MODE_STUBPLUS = 'stubplus';
// Simplified object, usually without any references to other objects, e.g. just an id and title.
export const OBJECT_MODE_STUB = 'stub';

export type ObjectMode = "private" | "public" | "stubplus" | "stub";

export const detailLevels: { [ObjectMode]: number } = {
  [OBJECT_MODE_PRIVATE]: 3,
  [OBJECT_MODE_PUBLIC]: 2,
  [OBJECT_MODE_STUBPLUS]: 1,
  [OBJECT_MODE_STUB]: 0,
  '': -1,
};

export default class Model {
  static getRelated(type: ObjectType, object: Object): Array<ObjectRequest> {
    if (object === null)
      return [];

    if (!mapTypesToClasses[type])
      throw new Error("unknown type: " + type);

    return mapTypesToClasses[type].getRelated(object);
  }

  static getFiles(type: ObjectType, object: Object): Array<ObjectFileDescription> {
    if (object === null)
      return [];

    if (!mapTypesToClasses[type])
      throw new Error("unknown type: " + type);

    return mapTypesToClasses[type].getFiles(object)
      .filter(f => f.url && f.url.startsWith('http'));
  }
}

export const getObject = createCachedSelector(
  (state, type) => state.objects[type],
  (state, type, id) => id,
  (objects, id) => objects[id] === undefined ? {id, _mode: ''} : objects[id],
)((state, type, id) => [type, id].join(':')); // group:123

export const isObjectSeen = createSelector(
  (state, objectType) => state.seen[objectType],
  (state, objectType, id) => id,
  (seenIds, id) => seenIds.indexOf(id) !== -1
);
