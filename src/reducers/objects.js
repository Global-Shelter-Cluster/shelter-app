// @flow

import {CLEAR_ALL_OBJECTS, SET_OBJECTS} from "../actions";
import type {Objects} from "../model";
import {initialObjectsState} from "../model";

const objects = (state: Objects = initialObjectsState, action: { type: string, objects?: Objects }) => {
  switch (action.type) {
    case CLEAR_ALL_OBJECTS:
      return initialObjectsState;
    case SET_OBJECTS:
      const newState = Object.assign({}, state); // copies references to the actual objects

      if (action.objects)
        for (const type in state)
          newState[type] = Object.assign({}, state[type], action.objects[type]);

      return newState;
    default:
      return state
  }
};

export default objects;
