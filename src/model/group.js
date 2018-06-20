// @flow

import type {ObjectFileDescription, ObjectRequest} from "../persist";
import {getObject} from "./index";
import moment from 'moment';
import createCachedSelector from 're-reselect';
import {getCurrentUser} from "./user";

type GroupType = "response" | "geographic_region" | "hub" | "strategic_advisory" | "working_group" | "community_of_practice";

// export type PrivateGroupObject = {
//   _last_read?: number,
//   _mode: "private",
//   _persist?: true,
//   type: GroupType,
//   id: number,
//   title: string,
//   url: string,
//   image?: string,
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
  image?: string,
  associated_regions?: Array<number>,
  parent_response?: number,
  latest_factsheet?: number,
  featured_documents?: Array<number>,
  key_documents?: Array<number>,
  recent_documents?: Array<number>,
  upcoming_events?: Array<number>,
  hubs?: Array<number>,
  responses?: Array<number>,
  working_groups?: Array<number>,
  regions?: Array<number>,
  communities_of_practice?: Array<number>,
  strategic_advisory?: number,
}

export type PublicGeographicRegionGroupObject = {
  _last_read?: number,
  _mode: "public",
  _persist?: true,
  type: "geographic_region",
  id: number,
  title: string,
  url: string,
  region_type?: string,
  image?: string,
  parent_region?: number,
  latest_factsheet?: number,
  featured_documents: Array<number>,
  key_documents: Array<number>,
  recent_documents: Array<number>,
  upcoming_events: Array<number>,
  hubs?: Array<number>,
  responses?: Array<number>,
  working_groups?: Array<number>,
  regions?: Array<number>,
  communities_of_practice?: Array<number>,
  strategic_advisory?: number,
}

export type PublicHubGroupObject = {
  _last_read?: number,
  _mode: "public",
  _persist?: true,
  type: "hub",
  id: number,
  title: string,
  url: string,
  image?: string,
  parent_response?: number,
  parent_region?: number,
  latest_factsheet?: number,
  featured_documents: Array<number>,
  key_documents: Array<number>,
  recent_documents: Array<number>,
  upcoming_events: Array<number>,
  hubs?: Array<number>,
  responses?: Array<number>,
  working_groups?: Array<number>,
  regions?: Array<number>,
  communities_of_practice?: Array<number>,
  strategic_advisory?: number,
}

export type PublicStrategicAdvisoryGroupObject = {
  _last_read?: number,
  _mode: "public",
  _persist?: true,
  type: "strategic_advisory",
  id: number,
  title: string,
  url: string,
  image?: string,
  parent_response?: number,
  parent_region?: number,
  latest_factsheet?: number,
  featured_documents: Array<number>,
  key_documents: Array<number>,
  recent_documents: Array<number>,
  upcoming_events: Array<number>,
  hubs?: Array<number>,
  responses?: Array<number>,
  working_groups?: Array<number>,
  regions?: Array<number>,
  communities_of_practice?: Array<number>,
  strategic_advisory?: number,
}

export type PublicWorkingGroupObject = {
  _last_read?: number,
  _mode: "public",
  _persist?: true,
  type: "working_group",
  id: number,
  title: string,
  url: string,
  image?: string,
  parent_response?: number,
  parent_region?: number,
  latest_factsheet?: number,
  featured_documents: Array<number>,
  key_documents: Array<number>,
  recent_documents: Array<number>,
  upcoming_events: Array<number>,
  hubs?: Array<number>,
  responses?: Array<number>,
  working_groups?: Array<number>,
  regions?: Array<number>,
  communities_of_practice?: Array<number>,
  strategic_advisory?: number,
}

export type PublicCommunityOfPracticeObject = {
  _last_read?: number,
  _mode: "public",
  _persist?: true,
  type: "community_of_practice",
  id: number,
  title: string,
  url: string,
  image?: string,
  parent_response?: number,
  parent_region?: number,
  latest_factsheet?: number,
  featured_documents: Array<number>,
  key_documents: Array<number>,
  recent_documents: Array<number>,
  upcoming_events: Array<number>,
  hubs?: Array<number>,
  responses?: Array<number>,
  working_groups?: Array<number>,
  regions?: Array<number>,
  communities_of_practice?: Array<number>,
  strategic_advisory?: number,
}

export type StubPlusGroupObject = {
  _last_read?: number,
  _mode: "stubplus",
  _persist?: true,
  type: GroupType,
  id: number,
  title: string,
  region_type?: string,
  image?: string,
  latest_factsheet?: number,
}

export type StubGroupObject = {
  _last_read?: number,
  _mode: "stub",
  _persist?: true,
  type: GroupType,
  id: number,
  title: string,
}

export type PublicGroupObject =
  PublicResponseGroupObject
  | PublicGeographicRegionGroupObject
  | PublicHubGroupObject
  | PublicStrategicAdvisoryGroupObject
  | PublicWorkingGroupObject
  | PublicCommunityOfPracticeObject;

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

  static getFiles(group: GroupObject): Array<ObjectFileDescription> {
    const files = [];

    if (group.image !== undefined)
      files.push({type: "group", id: group.id, property: "image", url: group.image});

    return files;
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

export const isFollowing = createCachedSelector(
  state => getCurrentUser(state),
  (state, groupId) => groupId,
  (user, groupId) => {
    if (user.groups === undefined)
      return false;
    for (const id of user.groups)
      if (id === groupId)
        return true;
    return false;
  }
)((state, groupId) => groupId);
