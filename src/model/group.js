// @flow

import type {ObjectRequest} from "../persist";
import type {PrivateUserObject, UserObject} from "./user";
import {getCurrentUser} from "./user";
import {createSelector} from 'reselect';
import createCachedSelector from 're-reselect';
import {OBJECT_MODE_STUB} from "./index";

export type PrivateGroupObject = {
  _last_read?: number,
  _mode: "private",
  type: "response" | "geographic-region" | "hub" | "strategic-advisory" | "working-group",
  id: number,
  title: string,
  associated_regions: Array<number>,
  parent_response: number,
}

export type PublicGroupObject = {
  _last_read?: number,
  _mode: "public",
  type: "response" | "geographic-region" | "hub" | "strategic-advisory" | "working-group",
  id: number,
  title: string,
  associated_regions: Array<number>,
  parent_response: number,
}

export type StubGroupObject = {
  _last_read?: number,
  _mode: "stub",
  type: "response" | "geographic-region" | "hub" | "strategic-advisory" | "working-group",
  id: number,
  title: string,
}

export type GroupObject = PrivateGroupObject | PublicGroupObject | StubGroupObject;

class Group {
  static getRelated(group: GroupObject): Array<ObjectRequest> {
    const ret = [];

    ret.push(...group._mode !== OBJECT_MODE_STUB
      ? group.associated_regions.map(id => ({type: "group", id: id}))
      : []);

    if (group._mode !== OBJECT_MODE_STUB && group.parent_response)
      ret.push({type: "group", id: group.parent_response});

    return ret;
  }

  static expand(id: number, groups: { [id: string]: GroupObject }, users: { [id: string]: UserObject }) {
    const ret = Object.assign({}, groups['' + id]);
    ret.user_count = users.length;
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
  (user: PrivateUserObject, groups: Array<GroupObject>) =>
    user
      ? user.groups
        .filter(id => groups[id] !== undefined)
        .map(id => groups[id])
      : []
);

export default Group;
