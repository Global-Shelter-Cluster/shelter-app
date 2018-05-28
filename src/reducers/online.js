// @flow

import {CHANGE_ONLINE_STATUS} from "../actions";

const online = (state: boolean = false, action: { type: string, isOnline?: boolean }) => {
  switch (action.type) {
    case CHANGE_ONLINE_STATUS:
      return action.isOnline;
    default:
      return state
  }
};

export default online;
