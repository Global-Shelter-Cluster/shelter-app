// @flow

import type {ObjectRequest} from "../persist";
import {createSelector} from 'reselect';
import {getCurrentUser} from "./user";
import {getObject} from "./index";
import moment from 'moment';

export type AlertObject = {
  _last_read?: number,
  _mode: "public",
  _persist?: true,
  id: number,
  created: string, // date
  groups?: Array<number>,
  title: string,
  description?: string, // HTML
  document?: number,
  event?: number,
  factsheet?: number,
  kobo_form?: number,
  group?: number,
  url?: string,
}

export default class Alert {
  static getRelated(alert: AlertObject): Array<ObjectRequest> {
    const ret = [];

    if (alert.groups !== undefined)
      ret.push(...alert.groups.map(id => ({type: "group", id: id})));

    [
      'document',
      'event',
      'factsheet',
      'kobo_form',
      'group',
    ].map(key => {
      if (alert[key] !== undefined)
        ret.push({type: key, id: alert[key]});
    });

    return ret;
  }

  static getFiles(): [] {
    return [];
  }
}

export const getUnseenAlertIdsForGroup = createSelector(
  state => state,
  state => state.seen.alert,
  (state, groupId) => getObject(state, 'group', groupId),
  (state, seenAlerts, group) => group.alerts === undefined
    ? []
    : group.alerts.filter(alertId => seenAlerts.indexOf(alertId) === -1)
);

export const getUnseenAlertIds = createSelector(
  state => state,
  state => getCurrentUser(state),
  (state, user) => user.groups === undefined
    ? []
    : user.groups
      .reduce((all, groupId) => [...all, ...getUnseenAlertIdsForGroup(state, groupId)], [])
      .filter((value, index, self) => self.indexOf(value) === index) // unique values (adapted from https://stackoverflow.com/a/14438954/368864)
      .sort((a, b) => {
        const aObj = getObject(state, 'alert', a);
        const bObj = getObject(state, 'alert', b);
        return moment(bObj.created).isAfter(aObj.created);
      })
);
