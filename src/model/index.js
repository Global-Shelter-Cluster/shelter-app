// @flow

import User from "./user";
import Group from "./group";
import type {ObjectRequest} from "../persist";
import type {UserObject} from "./user";
import type {GroupObject} from "./group";

export interface Objects {
  user?: { [number]: UserObject },
  group?: { [number]: GroupObject },
}

export const initialObjectsState: Objects = {
  user: {},
  group: {},
};

class Model {
  static getRelated(type, object): Array<ObjectRequest> {
    switch (type) {
      case 'user':
        return User.getRelated(object);
      case 'group':
        return Group.getRelated(object);
      default:
        throw new Error("unknown type: " + type)
    }
  }
}

export default Model;
