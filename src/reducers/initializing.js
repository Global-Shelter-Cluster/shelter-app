// @flow

import {CHANGE_INITIALIZING} from "../actions";

const initializing = (state: boolean = true, action: { type: string, isInitializing?: boolean }) => {
  switch (action.type) {
    case CHANGE_INITIALIZING:
      return action.isInitializing;
    default:
      return state
  }
};

export default initializing;
