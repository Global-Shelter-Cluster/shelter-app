// @flow

import type {Files} from "../persist";
import {SET_FILES} from "../actions";

const files = (state: Files = {}, action: { type: string, files: Files }) => {
  switch (action.type) {
    case SET_FILES:
      return action.files;
    default:
      return state
  }
};

export default files;
