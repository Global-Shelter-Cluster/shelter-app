// @flow

import {CLEAR_ALL_OBJECTS, SET_OBJECTS} from "../actions/index";
import type {UserObject} from "../model/user";
import type {GroupObject} from "../model/group";

export interface Objects {
  user?: { [number]: UserObject },
  group?: { [number]: GroupObject },
}

const initialObjectsState: Objects = {user: {}, group: {}};

const objects = (state: Objects = initialObjectsState, action: { type: string, objects?: Objects }) => {
  switch (action.type) {
    case CLEAR_ALL_OBJECTS:
      return initialObjectsState;
    case SET_OBJECTS:
      // debugger;
      const newState = Object.assign({}, state); // copies references to the actual objects
      if (action.objects)
        for (const type in state)
          newState[type] = Object.assign({}, state[type], action.objects[type]);
      console.log('newState',newState,state,action);
      return newState;
    default:
      return state
  }
};

export default objects;
