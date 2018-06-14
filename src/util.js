// @flow

import moment from "moment/moment";

export const timeAgo = (date: string, limitDays: number = 7) => {
  const daysDiff = moment().diff(date, "days");

  if (daysDiff === 0)
    return "today";
  else if (daysDiff > 0 && daysDiff <= limitDays)
    return moment(date).from(moment().format('YYYY-MM-DD'));
  else
    return moment(date).format('D MMM YYYY');
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
