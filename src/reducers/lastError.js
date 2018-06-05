// @flow

import {SET_LAST_ERROR} from "../actions";
import {CLEAR_LAST_ERROR} from "../actions/index";

export type lastErrorType = {
  type: string | null,
  data: {} | null,
}

const lastError = (state: lastErrorType = {
  type: null,
  data: null
}, action: { type: string, data: {} }) => {
  switch (action.type) {
    case SET_LAST_ERROR:
      return action.data;
    case CLEAR_LAST_ERROR:
      return {type: null, data: null};
    default:
      return state
  }
};

export default lastError;
