// @flow

import {CHANGE_FLAG} from "../actions";

export type flagsType = {
  initializing: boolean,
  online: boolean,
  loggingIn: boolean,
  loading: boolean,
  following: boolean, // or un-following
  submitting: boolean, // e.g. submitting a webform
}

const initialFlags = {
  initializing: true,
  online: false,
  loggingIn: false,
  loading: false,
  following: false,
  submitting: false,
};

export type flags = "initializing" | "online" | "loggingIn" | "loading" | "following" | "submitting";

const initializing = (state: flagsType = initialFlags, action: { type: string, flag: flags, value: boolean }) => {
  switch (action.type) {
    case CHANGE_FLAG:
      const newState = Object.assign({}, state);
      newState[action.flag] = action.value;
      return newState;
    default:
      return state;
  }
};

export default initializing;
