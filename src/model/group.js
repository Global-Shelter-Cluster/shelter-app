// @flow

import type {ObjectRequest} from "../persist";
// import {createSelector} from 'reselect';
import {getObject, OBJECT_MODE_STUB} from "./index";
import moment from 'moment';
import createCachedSelector from 're-reselect';

// export type PrivateGroupObject = {
//   _last_read?: number,
//   _mode: "private",
//   _persist?: true,
//   type: "response" | "geographic-region" | "hub" | "strategic-advisory" | "working-group",
//   id: number,
//   title: string,
//   associated_regions: Array<number>,
//   parent_response: number,
//   latest_factsheet: number,
//   featured_documents: Array<number>,
//   key_documents: Array<number>,
//   recent_documents: Array<number>,
// }

export type PublicResponseGroupObject = {
  _last_read?: number,
  _mode: "public",
  _persist?: true,
  type: "response",
  id: number,
  title: string,
  associated_regions?: Array<number>,
  parent_response?: number,
  latest_factsheet?: number,
  featured_documents: Array<number>,
  key_documents: Array<number>,
  recent_documents: Array<number>,
}

export type PublicGeographicRegionGroupObject = {
  _last_read?: number,
  _mode: "public",
  _persist?: true,
  type: "geographic-region",
  id: number,
  title: string,
  parent_region?: number,
  latest_factsheet?: number,
  featured_documents: Array<number>,
  key_documents: Array<number>,
  recent_documents: Array<number>,
}

export type PublicHubGroupObject = {
  _last_read?: number,
  _mode: "public",
  _persist?: true,
  type: "hub",
  id: number,
  title: string,
  parent_response?: number,
  parent_region?: number,
  latest_factsheet?: number,
  featured_documents: Array<number>,
  key_documents: Array<number>,
  recent_documents: Array<number>,
}

export type PublicStrategicAdvisoryGroupObject = {
  _last_read?: number,
  _mode: "public",
  _persist?: true,
  type: "strategic-advisory",
  id: number,
  title: string,
  parent_response?: number,
  parent_region?: number,
  latest_factsheet?: number,
  featured_documents: Array<number>,
  key_documents: Array<number>,
  recent_documents: Array<number>,
}

export type PublicWorkingGroupObject = {
  _last_read?: number,
  _mode: "public",
  _persist?: true,
  type: "working-group",
  id: number,
  title: string,
  parent_response?: number,
  parent_region?: number,
  latest_factsheet?: number,
  featured_documents: Array<number>,
  key_documents: Array<number>,
  recent_documents: Array<number>,
}
//
// export type PublicGroupObject = {
//   _last_read?: number,
//   _mode: "public",
//   _persist?: true,
//   type: "response" | "geographic-region" | "hub" | "strategic-advisory" | "working-group",
//   id: number,
//   title: string,
//   associated_regions: Array<number>,
//   parent_response: number,
//   latest_factsheet: number,
//   featured_documents: Array<number>,
//   key_documents: Array<number>,
//   recent_documents: Array<number>,
// }

export type StubGroupObject = {
  _last_read?: number,
  _mode: "stub",
  _persist?: true,
  type: "response" | "geographic-region" | "hub" | "strategic-advisory" | "working-group",
  id: number,
  title: string,
}

export type PublicGroupObject =
  PublicResponseGroupObject
  | PublicGeographicRegionGroupObject
  | PublicHubGroupObject
  | PublicStrategicAdvisoryGroupObject
  | PublicWorkingGroupObject;

export type GroupObject =
  StubGroupObject
  | PublicResponseGroupObject
  | PublicGeographicRegionGroupObject
  | PublicHubGroupObject
  | PublicStrategicAdvisoryGroupObject
  | PublicWorkingGroupObject;
// export type GroupObject = PublicGroupObject | StubGroupObject;
// export type GroupObject = PrivateGroupObject | PublicGroupObject | StubGroupObject;

export default class Group {
  static getRelated(group: GroupObject): Array<ObjectRequest> {
    const ret = [];

    ret.push(...group._mode !== OBJECT_MODE_STUB && group.associated_regions !== undefined
      ? group.associated_regions.map(id => ({type: "group", id: id}))
      : []);

    if (group._mode !== OBJECT_MODE_STUB && group.parent_response)
      ret.push({type: "group", id: group.parent_response});

    if (group._mode !== OBJECT_MODE_STUB && group.latest_factsheet)
      ret.push({type: "factsheet", id: group.latest_factsheet});

    ['featured', 'key', 'recent'].map(key => ret
      .push(...group._mode !== OBJECT_MODE_STUB
        ? group[key + '_documents'].map(id => ({type: "document", id: id}))
        : [])
    );

    return ret;
  }

  static getFiles(): [] {
    return [];
  }

  // static expand(id: number, groups: { [id: string]: GroupObject }, users: { [id: string]: UserObject }, factsheets: { [id: string]: FactsheetObject }): ExpandedGroupObject {
  //   const ret: ExpandedGroupObject = Object.assign({}, groups['' + id]);
  //
  //   ret.associated_regions = ret.associated_regions.map(id => groups[id]);
  //   if (ret.parent_response)
  //     ret.parent_response = groups[ret.parent_response];
  //
  //   if (ret.latest_factsheet)
  //     ret.latest_factsheet = factsheets[ret.latest_factsheet];
  //
  //   // ret.user_count = users.length;
  //
  //   return ret;
  // }
}

// export const getGroup = createCachedSelector(
//   (id, state) => id,
//   (id, state) => state.objects.group,
//   (id, groups) => groups[id],
// )((id, state) => id);
//
// export const getGroup = createCachedSelector(
//   (id, state) => id,
//   (id, state) => state.objects.group,
//   (id, state) => state.objects.user,
//   (id, state) => state.objects.factsheet,
//   Group.expand
// )((id, state) => id);
//
// export const getUserGroups = createSelector(
//   [getCurrentUser, state => state.objects.group],
//   (user: PrivateUserObject, groups: Array<GroupObject>) =>
//     user
//       ? user.groups
//         .filter(id => groups[id] !== undefined)
//         .map(id => groups[id])
//       : []
// );

const RECENT_DOCS_MAX_DAYS = 7; // how many days ago are docs still considered "recent"

export const getRecentDocumentsCount = createCachedSelector(
  (state, id) => state,
  (state, id) => id,
  () => moment(),
  (state, id, now) => state.objects.group[id].recent_documents.map(id => getObject(state, 'document', id)).filter(d => now.diff(d.changed, 'days') <= RECENT_DOCS_MAX_DAYS).length
)((state, id) => moment().format('YYYY-MM-DD')); // e.g. "2018-06-08"
