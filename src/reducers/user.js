// @flow

import {SET_USER_DATA} from "../actions/index";

export interface UserData {
  id: number,
  updated: number,
  groups: Array<number>,
  username: string,
}

export interface User {
  isLoading: boolean,
  data?: UserData,
}

const initial: User = {
  isLoading: true,
};

const user = (state: User = initial, action: { type: string, userData: UserData }) => {
  switch (action.type) {
    case SET_USER_DATA:
      if (action.userData === null)
        return {isLoading: false};
      else
        return {isLoading: false, data: action.userData};
    default:
      return state
  }
};

export default user;
