// @flow

import type {ObjectRequest} from "../persist";
import {getObject} from "./index";
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
  url: string,
  associated_regions?: Array<number>,
  parent_response?: number,
  latest_factsheet?: number,
  featured_documents?: Array<number>,
  key_documents?: Array<number>,
  recent_documents?: Array<number>,
  upcoming_events?: Array<number>,
}

export type PublicGeographicRegionGroupObject = {
  _last_read?: number,
  _mode: "public",
  _persist?: true,
  type: "geographic-region",
  id: number,
  title: string,
  url: string,
  parent_region?: number,
  latest_factsheet?: number,
  featured_documents: Array<number>,
  key_documents: Array<number>,
  recent_documents: Array<number>,
  upcoming_events: Array<number>,
}

export type PublicHubGroupObject = {
  _last_read?: number,
  _mode: "public",
  _persist?: true,
  type: "hub",
  id: number,
  title: string,
  url: string,
  parent_response?: number,
  parent_region?: number,
  latest_factsheet?: number,
  featured_documents: Array<number>,
  key_documents: Array<number>,
  recent_documents: Array<number>,
  upcoming_events: Array<number>,
}

export type PublicStrategicAdvisoryGroupObject = {
  _last_read?: number,
  _mode: "public",
  _persist?: true,
  type: "strategic-advisory",
  id: number,
  title: string,
  url: string,
  parent_response?: number,
  parent_region?: number,
  latest_factsheet?: number,
  featured_documents: Array<number>,
  key_documents: Array<number>,
  recent_documents: Array<number>,
  upcoming_events: Array<number>,
}

export type PublicWorkingGroupObject = {
  _last_read?: number,
  _mode: "public",
  _persist?: true,
  type: "working-group",
  id: number,
  title: string,
  url: string,
  parent_response?: number,
  parent_region?: number,
  latest_factsheet?: number,
  featured_documents: Array<number>,
  key_documents: Array<number>,
  recent_documents: Array<number>,
  upcoming_events: Array<number>,
}

export type StubPlusGroupObject = {
  _last_read?: number,
  _mode: "stubplus",
  _persist?: true,
  type: "response" | "geographic-region" | "hub" | "strategic-advisory" | "working-group",
  id: number,
  title: string,
  latest_factsheet?: number,
}

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

export type GroupObject = StubGroupObject | StubPlusGroupObject | PublicGroupObject;

export default class Group {
  static getRelated(group: GroupObject): Array<ObjectRequest> {
    const ret = [];

    ret.push(...group.associated_regions !== undefined
      ? group.associated_regions.map(id => ({type: "group", id: id}))
      : []);

    if (group.parent_response !== undefined)
      ret.push({type: "group", id: group.parent_response});

    if (group.latest_factsheet !== undefined)
      ret.push({type: "factsheet", id: group.latest_factsheet});

    ['featured', 'key', 'recent'].map(key => ret
      .push(...group[key + '_documents'] !== undefined
        ? group[key + '_documents'].map(id => ({type: "document", id: id}))
        : [])
    );

    if (group.upcoming_events !== undefined)
      ret.push(...group.upcoming_events.map(id => ({type: "event", id: id})));

    return ret;
  }

  static getFiles(): [] {
    return [];
  }
}

const RECENT_DOCS_MAX_DAYS = 7; // how many days ago are docs still considered "recent"

export const getRecentDocumentsCount = createCachedSelector(
  state => state,
  (state, groupId) => groupId,
  (state, groupId) => {
    const now = moment();
    return state.objects.group[groupId].recent_documents !== undefined
      ? state.objects.group[groupId].recent_documents
        .map(id => getObject(state, 'document', id))
        .filter(d => d && now.diff(d.date, 'days') <= RECENT_DOCS_MAX_DAYS)
        .length
      : 0
  }
)((state, groupId) => [groupId, moment().format('YYYY-MM-DD')].join(':')); // e.g. "12345:2018-06-08"
