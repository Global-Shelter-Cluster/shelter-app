// @flow

import type {ObjectFileDescription, ObjectRequest} from "../persist";
import {createSelector} from 'reselect';
import {getCurrentUser} from "./user";
import {getObject} from "./index";
import moment from 'moment';
import type {Paragraphs} from "./paragraphs";
import {getFilesFromParagraphs} from "./paragraphs";
import type {DateString, UrlString} from "./index";

const UNSEEN_NEWS_MAX_DAYS = 14; // if news are unseen but older than this number of days, don't count them

export type PublicNewsObject = {
  _last_read?: number,
  _mode: "public",
  _persist?: true,
  id: number,
  title: string,
  date: DateString,
  groups?: Array<number>,
  content: Paragraphs,
  url: UrlString,
}

export type StubNewsObject = {
  _last_read?: number,
  _mode: "stub",
  _persist?: true,
  id: number,
  title: string,
  date: DateString,
}

export type NewsObject = PublicNewsObject | StubNewsObject;

export default class News {
  static getRelated(news: NewsObject): Array<ObjectRequest> {
    const ret = [];

    if (news.groups !== undefined)
      ret.push(...news.groups.map(id => ({type: "group", id: id})));

    if (news.content !== undefined)
      getRelatedFromParagraphs(ret, news.content);

    return ret;
  }

  static getFiles(news: NewsObject): Array<ObjectFileDescription> {
    const files = [];

    if (news.content !== undefined)
      getFilesFromParagraphs(files, news.content, "news", news.id, ".content");

    return files;
  }
}

export const getUnseenNewsIdsForGroup = createSelector(
  state => state,
  state => state.seen.news,
  (state, groupId) => getObject(state, 'group', groupId),
  (state, seenNews, group) => group.news === undefined
    ? []
    : group.news
      .filter(newsId => seenNews.indexOf(newsId) === -1)
      .filter(newsId => {
        const now = moment();
        const a:NewsObject = getObject(state, 'news', newsId);
        return (a && now.diff(a.date, 'days') <= UNSEEN_NEWS_MAX_DAYS)
      })
);

export const getUnseenNewsIds = createSelector(
  state => state,
  state => getCurrentUser(state),
  (state, user) => !user || user.groups === undefined
    ? []
    : user.groups
      .reduce((all, groupId) => [...all, ...getUnseenNewsIdsForGroup(state, groupId)], [])
      .filter((value, index, self) => self.indexOf(value) === index) // unique values (adapted from https://stackoverflow.com/a/14438954/368864)
      .sort((a, b) => {
        const aObj = getObject(state, 'news', a);
        const bObj = getObject(state, 'news', b);
        return moment(bObj.date).isAfter(aObj.date);
      })
);
