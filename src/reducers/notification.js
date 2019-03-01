// @flow

import {CLEAR_NOTIFICATION, SET_NOTIFICATION} from "../actions";

export type notificationType = {
  title: string,
  body?: string,
  link?: string,
  id?: number,
}

const notification = (state: notificationType | null = null, action: { type: string, notification?: notificationType }) => {
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
