// @flow

import {SET_CURRENT_USER} from "../actions/index";

const currentUser = (state: number | null = null, action: { type: string, id: number }) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return action.id;
    default:
      return state
  }
};

export default currentUser;
