// @flow

import {CLEAR_NOTIFICATION, SET_NOTIFICATION} from "../actions";

export type notificationType = {
  title: string,
  body?: string,
  link?: string,
  id?: number,
}

const notification = (state: notificationType | null =
                        null
                      // {title: "Ecuador Earthquake 2018 (response)",body: "A factsheet was recently added: January 2019",data: {link: "a", id: 123}}
  , action: { type: string, notification?: notificationType }) => {
  switch (action.type) {
    case SET_NOTIFICATION:
      return action.notification;
    case CLEAR_NOTIFICATION:
      return null;
    default:
      return state
  }
};

export default notification;
