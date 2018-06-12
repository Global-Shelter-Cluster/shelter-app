// @flow

import {CHANGE_FLAG} from "../actions";

export type flagsType = {
  initializing: boolean,
  online: boolean,
  loggingIn: boolean,
}

const initialFlags = {
  initializing: true,
  online: false,
  loggingIn: false,
};

export type flags = "initializing" | "online" | "loggingIn";

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
