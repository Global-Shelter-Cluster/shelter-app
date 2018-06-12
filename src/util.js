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
