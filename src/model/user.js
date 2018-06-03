// @flow

import type {ObjectRequest} from "../persist";
import {createSelector} from 'reselect';
import {OBJECT_MODE_PRIVATE} from "./index";

export type PrivateUserObject = {
  _last_read?: number,
  _mode: "private",
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
}

export const getCurrentUser = createSelector(
  [state => state.currentUser, state => state.objects.user],
  (currentUser, users) => users[currentUser]
);

export default User;
