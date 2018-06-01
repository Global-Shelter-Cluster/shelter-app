// @flow

import type {ObjectRequest} from "../persist";
import type {UserObject} from "./user";
import {getCurrentUser} from "./user";
import {createSelector} from 'reselect';
import createCachedSelector from 're-reselect';

export interface GroupObject {
  _last_read?: number,
  type: "response" | "geographic-region" | "hub" | "strategic-advisory" | "working-group",
  id: number,
  title: string,
}

class Group {
  static getRelated(group: GroupObject): Array<ObjectRequest> {
    return [];
  }

  static expand(id, groups, users) {
    const ret = Object.assign({}, groups[id]);
    ret.user_count = users.length;
    console.log('EXPAND', groups, users, id);
    return ret;
  }
}

export const getGroup = createCachedSelector(
  (id, state) => id,
  (id, state) => state.objects.group,
  (id, state) => state.objects.user,
  Group.expand
)((id, state) => id);

export const getUserGroups = createSelector(
  [getCurrentUser, state => state.objects.group],
  (user: UserObject, groups: Array<GroupObject>) =>
    user
      ? user.groups
        .filter(id => groups[id] !== undefined)
        .map(id => groups[id])
      : []
);

export default Group;
