// @flow

import type {ObjectRequest} from "../persist";
import {createSelector} from 'reselect';

export interface UserObject {
  _last_read?: number,
  id: number,
  name: string,
  mail: string,
  picture: string,
  groups?: Array<number>,
}

class User {
  static getRelated(user: UserObject): Array<ObjectRequest> {
    const groups = user.groups.map(id => ({type: "group", id: id}));
    return groups;
  }
}

export const getCurrentUser = createSelector(
  [state => state.currentUser, state => state.objects.user],
  (currentUser, users) => users[currentUser]
);

export default User;
