// @flow

import {MERGE_LOCAL_VARS} from "../actions";

export type localVarsType = {
  downloadFiles: boolean,
  askedToDownloadFiles: boolean, // if true, doesn't prompt the user anymore
}

// Used in conjunction with MERGE_LOCAL_VARS
export type localVarsTypeAllOptional = {
  downloadFiles?: boolean,
  askedToDownloadFiles?: boolean,
}

const initialLocalVars: localVarsType = {
  downloadFiles: false,
  askedToDownloadFiles: false,
};

const localVars = (state: localVarsType = initialLocalVars, action: { type: string, localVars: localVarsTypeAllOptional }) => {
  switch (action.type) {
    case MERGE_LOCAL_VARS:
      return Object.assign({}, state, action.localVars);
    default:
      return state;
  }
};

export default localVars;
