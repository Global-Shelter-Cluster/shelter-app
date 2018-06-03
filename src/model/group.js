// @flow

import type {ObjectRequest} from "../persist";
import type {PrivateUserObject, UserObject} from "./user";
import {getCurrentUser} from "./user";
import {createSelector} from 'reselect';
import createCachedSelector from 're-reselect';
import {OBJECT_MODE_STUB} from "./index";
import type {FactsheetObject} from "./factsheet";

export type ExpandedGroupObject = {
  _last_read?: number,
  _mode: "private",
  type: "response" | "geographic-region" | "hub" | "strategic-advisory" | "working-group",
  id: number,
  title: string,
  associated_regions: Array<GroupObject>,
  parent_response: GroupObject,
  latest_factsheet: FactsheetObject,
}

export type PrivateGroupObject = {
  _last_read?: number,
  _mode: "private",
  type: "response" | "geographic-region" | "hub" | "strategic-advisory" | "working-group",
  id: number,
  title: string,
  associated_regions: Array<number>,
  parent_response: number,
  latest_factsheet: number,
}

export type PublicGroupObject = {
  _last_read?: number,
  _mode: "public",
  type: "response" | "geographic-region" | "hub" | "strategic-advisory" | "working-group",
  id: number,
  title: string,
  associated_regions: Array<number>,
  parent_response: number,
  latest_factsheet: number,
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

    if (group._mode !== OBJECT_MODE_STUB && group.latest_factsheet)
      ret.push({type: "factsheet", id: group.latest_factsheet});

    return ret;
  }

  static expand(id: number, groups: { [id: string]: GroupObject }, users: { [id: string]: UserObject }, factsheets: { [id: string]: FactsheetObject }): ExpandedGroupObject {
    const ret: ExpandedGroupObject = Object.assign({}, groups['' + id]);

    ret.associated_regions = ret.associated_regions.map(id => groups[id]);
    if (ret.parent_response)
      ret.parent_response = groups[ret.parent_response];

    if (ret.latest_factsheet)
      ret.latest_factsheet = factsheets[ret.latest_factsheet];

    // ret.user_count = users.length;

    return ret;
  }
}

export const getGroup = createCachedSelector(
  (id, state) => id,
  (id, state) => state.objects.group,
  (id, state) => state.objects.user,
  (id, state) => state.objects.factsheet,
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
