// @flow

import type {UserObject} from "./user";
import User from "./user";
import type {GroupObject} from "./group";
import Group from "./group";
import type {ObjectRequest} from "../persist";
import type {FactsheetObject} from "./factsheet";
import Factsheet from "./factsheet";

export type Objects = {
  user?: { [id: string]: UserObject },
  group?: { [id: string]: GroupObject },
  factsheet?: { [id: string]: FactsheetObject },
}

export type Object = UserObject | GroupObject | FactsheetObject;

export const initialObjectsState: Objects = {
  user: {},
  group: {},
  factsheet: {},
};

const mapTypesToClasses = {
  'user': User,
  'group': Group,
  'factsheet': Factsheet,
};

// Highest level of detail, e.g. a user object includes the list of followed groups.
export const OBJECT_MODE_PRIVATE = 'private';
// Complete object, as seen by anonymous users.
export const OBJECT_MODE_PUBLIC = 'public';
// Simplified object, usually without any references to other objects, e.g. just an id and title.
export const OBJECT_MODE_STUB = 'stub';

export const objectModeLevels = {
  OBJECT_MODE_STUB: 0,
  OBJECT_MODE_PUBLIC: 1,
  OBJECT_MODE_PRIVATE: 2,
};

class Model {
  static getRelated(type: string, object: Object): Array<ObjectRequest> {
    if (!mapTypesToClasses[type])
      throw new Error("unknown type: " + type);

    return mapTypesToClasses[type].getRelated(object);
  }

  static getFiles(type: string, object: Object): Array<{}> {
    if (!mapTypesToClasses[type])
      throw new Error("unknown type: " + type);

    return mapTypesToClasses[type].getFiles(object);
  }
}

export default Model;
