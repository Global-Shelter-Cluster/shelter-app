// @flow

import type {ObjectRequest} from "../persist";
import type {UserObject} from "./user";
import {getCurrentUser} from "./user";
import {createSelector} from 'reselect';

export interface GroupObject {
  _last_read?: number,
  type: "response" | "geographic-region" | "hub" | "strategic-advisory" | "working-group",
  id: number,
  title: string,
}

class Group {
  static getRelated(group: GroupObject, deep: boolean = false): Array<ObjectRequest> {
    return [];
  }
}

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
