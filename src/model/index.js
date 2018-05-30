// @flow

import User from "./user";
import type {ObjectRequest} from "../persist";

class Model {
  static getChildren(type, object, deep: boolean = false): Array<ObjectRequest> {
    switch (type) {
      case 'user':
        return User.getChildren(object, deep);
    }
  }
}
