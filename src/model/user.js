// @flow

import type {ObjectFileDescription, ObjectRequest} from "../persist";
import {createSelector} from 'reselect';
import {OBJECT_MODE_PRIVATE, OBJECT_MODE_STUB} from "./index";

export type PrivateUserObject = {
  _last_read?: number,
  _mode: "private",
  _persist?: true,
  id: number,
  name: string,
  mail: string,
  picture: string,
  org: string,
  role: string,
  groups: Array<number>,
}

export type PublicUserObject = {
  _last_read?: number,
  _mode: "public",
  _persist?: true,
  id: number,
  name: string,
  mail: string,
  picture: string,
  org: string,
  role: string,
}

export type StubUserObject = {
  _last_read?: number,
  _mode: "stub",
  _persist?: true,
  id: number,
  name: string,
}

export type UserObject = PrivateUserObject | PublicUserObject | StubUserObject;

class User {
  static getRelated(user: UserObject): Array<ObjectRequest> {
    const ret = [];

    ret.push(...user._mode === OBJECT_MODE_PRIVATE
      ? user.groups.map(id => ({type: "group", id: id}))
      : []);

    return ret;
  }

  static getFiles(user: UserObject): Array<ObjectFileDescription> {
    return user._mode === OBJECT_MODE_STUB
      ? []
      : [{type: "user", id: user.id, property: "picture", url: user.picture}];
  }
}

export const getCurrentUser = createSelector(
  [state => state.currentUser, state => state.objects.user],
  (currentUser, users) => users[currentUser]
);

export default User;
