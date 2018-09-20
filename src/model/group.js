// @flow

import type {ObjectFileDescription, ObjectRequest} from "../persist";
import {getObject} from "./index";
import moment from 'moment';
import createCachedSelector from 're-reselect';
import {getCurrentUser} from "./user";

const RECENT_DOCS_MAX_DAYS = 30; // how many days ago are docs still considered "recent"

type GroupType =
  "response"
  | "geographic_region"
  | "hub"
  | "strategic_advisory"
  | "working_group"
  | "community_of_practice";

export type PrivateGroupObject = {
  _last_read?: number,
  _mode: "private",
  _persist?: true,
  type: GroupType,
  id: number,
  title: string,
  url: string,
  region_type?: "Country" | "Region",
  response_status?: "active" | "archived",
  image?: string,
  parent_region?: number,
  parent_response?: number,
  associated_regions?: Array<number>,
  latest_factsheet?: number,
  featured_documents?: Array<number>,
  key_documents?: Array<number>,
  recent_documents?: Array<number>,
  upcoming_events?: Array<number>,
  response_region_hierarchy?: Array<{ region: number, responses: Array<number> }>,
  regions?: Array<number>,
  responses?: Array<number>,
  hubs?: Array<number>,
  working_groups?: Array<number>,
  communities_of_practice?: Array<number>,
  strategic_advisory?: number,
  kobo_forms?: Array<number>,
  alerts?: Array<number>,
  followers: Array<number>,
}

export type PublicGroupObject = {
  _last_read?: number,
  _mode: "public",
  _persist?: true,
  type: GroupType,
  id: number,
  title: string,
  url: string,
  region_type?: "Country" | "Region",
  response_status?: "active" | "archived",
  image?: string,
  parent_region?: number,
  parent_response?: number,
  associated_regions?: Array<number>,
  latest_factsheet?: number,
  featured_documents?: Array<number>,
  key_documents?: Array<number>,
  recent_documents?: Array<number>,
  upcoming_events?: Array<number>,
  response_region_hierarchy?: Array<{ region: number, responses: Array<number> }>,
  regions?: Array<number>,
  responses?: Array<number>,
  hubs?: Array<number>,
  working_groups?: Array<number>,
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
  region_type?: "Country" | "Region",
  response_status?: "active" | "archived",
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
  region_type?: "Country" | "Region",
  response_status?: "active" | "archived",
}

export type GroupObject = StubGroupObject | StubPlusGroupObject | PublicGroupObject | PrivateGroupObject;

export default class Group {
  static getRelated(group: GroupObject): Array<ObjectRequest> {
    const ret = [];

    [
      'associated_regions',
      'hubs',
      'responses',
      'working_groups',
      'regions',
      'communities_of_practice',
    ].map(key => ret.push(...group[key] !== undefined
      ? group[key].map(id => ({type: "group", id: id}))
      : []));

    [
      'strategic_advisory',
      'parent_response',
    ].map(key => {
      if (group[key] !== undefined)
        ret.push({type: "group", id: group[key]});
    });

    if (group.latest_factsheet !== undefined)
      ret.push({type: "factsheet", id: group.latest_factsheet});

    ['featured', 'key', 'recent'].map(key => ret
      .push(...group[key + '_documents'] !== undefined
        ? group[key + '_documents'].map(id => ({type: "document", id: id}))
        : [])
    );

    if (group.upcoming_events !== undefined)
      ret.push(...group.upcoming_events.map(id => ({type: "event", id: id})));

    if (group.kobo_forms !== undefined)
      ret.push(...group.kobo_forms.map(id => ({type: "kobo_form", id: id})));

    if (group.alerts !== undefined)
      ret.push(...group.alerts.map(id => ({type: "alert", id: id})));

    if (group.contacts !== undefined)
      ret.push(...group.contacts.map(id => ({type: "contact", id: id})));

    if (group.followers !== undefined)
      ret.push(...group.followers.map(id => ({type: "user", id: id})));

    return ret;
  }

  static getFiles(group: GroupObject): Array<ObjectFileDescription> {
    const files = [];

    if (group.image !== undefined)
      files.push({type: "group", id: group.id, property: "image", url: group.image});

    return files;
  }
}

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

export const areAllSubregionsCountries = createCachedSelector(
  state => state,
  (state, groupId) => groupId,
  (state, groupId) => {
    if (state.objects.group[groupId] === undefined)
      return false;
    if (state.objects.group[groupId].regions === undefined)
      return false;

    for (let id of state.objects.group[groupId].regions) {
      const child: GroupObject = getObject(state, 'group', id);
      if (child.region_type === undefined || child.region_type !== 'Country')
        return false;
    }

    return true;
  }
)((state, groupId) => groupId);

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

export const getGroupTypeLabel = (group: GroupObject) => {
  return group.region_type !== undefined
    ? group.region_type.toLowerCase()
    : group.type.replace(/_/g, ' ');
};

export const getGroupTinyDescription = (group: GroupObject) => {
  const plural = (value, singular, plural) => value === 1
    ? value + ' ' + singular
    : value + ' ' + plural;

  const ret = [];

  if (group.responses !== undefined)
    ret.push(plural(group.responses.length, 'response', 'responses'));

  if (group.regions !== undefined)
    ret.push(plural(group.regions.length, 'region', 'regions'));

  if (group.hubs !== undefined)
    ret.push(plural(group.hubs.length, 'hub', 'hubs'));

  if (group.working_groups !== undefined)
    ret.push(plural(group.working_groups.length, 'working group', 'working groups'));

  if (group.communities_of_practice !== undefined)
    ret.push(plural(group.communities_of_practice.length, 'CoP', 'CoPs'));

  if (group.strategic_advisory !== undefined)
    ret.push('1 SAG');

  return ret.join(', ');
};

const dashboardBlocksVisibleByDefault: { [string]: { [dashboardBlock]: boolean } } = {
  response: {
    follow: true,
    alerts: true,
    followers: true,
    assessment_forms: true,
    documents: true,
    events: true,
    factsheets: true,
  },
  country: {
    follow: false,
    alerts: false,
    followers: false,
    assessment_forms: false,
    documents: true,
    events: true,
    factsheets: false,
  },
  region: {
    follow: false,
    alerts: false,
    followers: false,
    assessment_forms: false,
    documents: true,
    events: true,
    factsheets: false,
  },
  global: {
    follow: true,
    alerts: true,
    followers: true,
    assessment_forms: true,
    documents: true,
    events: true,
    factsheets: false,
  },
  hub: {
    follow: false,
    alerts: false,
    followers: false,
    assessment_forms: false,
    documents: true,
    events: true,
    factsheets: false,
  },
  strategic_advisory: {
    follow: true,
    alerts: true,
    followers: true,
    assessment_forms: true,
    documents: true,
    events: true,
    factsheets: false,
  },
  working_group: {
    follow: true,
    alerts: true,
    followers: true,
    assessment_forms: true,
    documents: true,
    events: true,
    factsheets: false,
  },
  community_of_practice: {
    follow: true,
    alerts: true,
    followers: true,
    assessment_forms: true,
    documents: true,
    events: true,
    factsheets: false,
  },
};

export type dashboardBlock =
  "follow"
  | "alerts"
  | "followers"
  | "assessment_forms"
  | "documents"
  | "events"
  | "factsheets";

export const isDashboardBlockVisibleByDefault = (group: GroupObject, block: dashboardBlock): boolean => {
  let type = group.type;
  if (group.type === "geographic_region") {
    switch (group.region_type) {
      case 'Country':
        type = 'country';
        break;
      case 'Region':
      // fall-through
      default:
        type = 'region';
    }

    if (group.title === 'Global')
      // TODO: this is clumsy and hacky, but to make it better we'd need to set some kind of signal on the backend.
      type = 'global';
  }

  if (dashboardBlocksVisibleByDefault[type] === undefined)
    return false;

  if (dashboardBlocksVisibleByDefault[type][block] === undefined)
    return false;

  return dashboardBlocksVisibleByDefault[type][block];
};
