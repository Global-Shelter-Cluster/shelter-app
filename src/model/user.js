// @flow

import type {ObjectRequest} from "../persist";

export interface UserObject {
  updated: number,
  id: number,
  name: string,
  groups: Array<number>,
}

class User {
  static getChildren(user: UserObject, deep: boolean = false): Array<ObjectRequest> {
    const groups = user.groups.map(id => ({type: "group", id: id}));
    return groups;
  }
}

export default User;
