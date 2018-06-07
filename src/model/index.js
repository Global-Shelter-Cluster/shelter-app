// @flow

import type {UserObject} from "./user";
import User from "./user";
import type {GroupObject} from "./group";
import Group from "./group";
import type {ObjectFileDescription, ObjectRequest} from "../persist";
import type {FactsheetObject} from "./factsheet";
import Factsheet from "./factsheet";
import type {DocumentObject} from "./document";
import Document from "./document";
import createCachedSelector from 're-reselect';

export type Objects = {
  user?: { [id: string]: UserObject },
  group?: { [id: string]: GroupObject },
  factsheet?: { [id: string]: FactsheetObject },
  document?: { [id: string]: DocumentObject },
}

export type Object = UserObject | GroupObject | FactsheetObject | DocumentObject;

export const initialObjectsState: Objects = {
  user: {},
  group: {},
  factsheet: {},
  document: {},
};

const mapTypesToClasses = {
  'user': User,
  'group': Group,
  'factsheet': Factsheet,
  'document': Document,
};

// Highest level of detail, e.g. a user object includes the list of followed groups.
export const OBJECT_MODE_PRIVATE = 'private';
// Complete object, as seen by anonymous users.
export const OBJECT_MODE_PUBLIC = 'public';
// Simplified object, usually without any references to other objects, e.g. just an id and title.
export const OBJECT_MODE_STUB = 'stub';

class Model {
  static getRelated(type: string, object: Object): Array<ObjectRequest> {
    if (!mapTypesToClasses[type])
      throw new Error("unknown type: " + type);

    return mapTypesToClasses[type].getRelated(object);
  }

  static getFiles(type: string, object: Object): Array<ObjectFileDescription> {
    if (!mapTypesToClasses[type])
      throw new Error("unknown type: " + type);

    return mapTypesToClasses[type].getFiles(object);
  }
}

export const getObject = createCachedSelector(
  (state, type, id) => state.objects[type],
  (state, type, id) => id,
  (objects, id) => objects[id],
)((state, type, id) => [type, id].join(':'));

export default Model;
