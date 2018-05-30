// @flow

import {CLEAR_ALL_OBJECTS, SET_OBJECTS} from "../actions/index";
import type {UserObject} from "../model/user";
import type {GroupObject} from "../model/group";

export interface Objects {
  users: Array<UserObject>,
  groups: Array<GroupObject>,
}

const initialObjectsState: Objects = {users: [], groups: []};

const objects = (state: Objects = initialObjectsState, action: { type: string, objects?: {} }) => {
  switch (action.type) {
    case CLEAR_ALL_OBJECTS:
      return initialObjectsState;
    case SET_OBJECTS:
      const newState = Object.assign({}, state); // shallow copy
      for (const type in state) {
        if (action.objects !== undefined && action.objects[type] !== undefined)
          newState[type] = Object.assign({}, state[type], action.objects[type]);
      }
      return newState;
    default:
      return state
  }
};

export default objects;
