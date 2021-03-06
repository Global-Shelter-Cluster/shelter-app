// @flow

import moment from "moment/moment";
import equal from 'deep-equal';
import {Platform, StyleSheet} from "react-native";
import htmlparser from "htmlparser2";

export const timeAgo = (date: string, limitDays: number = 7, includeTime: boolean = false) => {
  const daysDiff = moment().diff(date, "days");

  if (!includeTime && daysDiff === 0)
    return "today";
  else if (daysDiff >= 0 && daysDiff <= limitDays)
    return moment(date).from(includeTime ? moment() : moment().format('YYYY-MM-DD'));
  else
    return moment(date).format(includeTime ? 'D MMM YYYY, h:mm a' : 'D MMM YYYY');
};

// getExtension() function adapted from https://stackoverflow.com/a/6997591/368864
export const getExtension = url => (url = url
  .substr(1 + url.lastIndexOf("/"))
  .split('?')[0]).split('#')[0]
  .substr(
    url.lastIndexOf(".") === -1
      ? Number.MAX_SAFE_INTEGER
      : url.lastIndexOf(".")
  ).toLowerCase();

const shallowPropEqual = (a: {}, b: {}, properties: Array<string>) => {
  for (const p of properties)
    if (a[p] !== b[p])
      return false;
  return true;
};

export const propEqual = (a: {}, b: {}, shallowProps: Array<string>, deepProps: Array<string> = []) => {
  if (!shallowPropEqual(a, b, shallowProps))
    return false;
  for (const p of deepProps)
    if (!equal(a[p], b[p]))
      return false;
  return true;
};

export const hairlineWidth = Platform.OS === 'ios'
  ? StyleSheet.hairlineWidth
  : 1; // hairlineWidth gives inconsistent results on Android

export const html2text = html => {
  let ret = '';
  let skip: boolean = false;

  const parser = new htmlparser.Parser({
    onopentag: function (name, attribs) {
      switch (name) {
        case "script":
          skip = true;
          break;
        case "br":
        case "p":
          ret += "\n";
          break;
      }
    },
    ontext: function (text) {
      if (!skip)
        ret += text;
    },
    onclosetag: function (tagname) {
      if (tagname === "script") {
        skip = false;
      }
    }
  }, {decodeEntities: true});

  parser.write(html);
  parser.end();

  return ret.trim();
};
