// @flow

import {CLEAR_ALL_OBJECTS, SET_OBJECTS} from "../actions";
import type {Objects} from "../model";
import {initialObjectsState, objectModeLevels} from "../model";

const objects = (state: Objects = initialObjectsState, action: { type: string, objects?: Objects }) => {
  switch (action.type) {
    case CLEAR_ALL_OBJECTS:
      return initialObjectsState;

    case SET_OBJECTS:
      const newState = Object.assign({}, state); // copies references to the actual objects

      if (action.objects)
        for (const type in state) {
          // Only replace objects with the same level of detail ("object mode") or higher: private > public > stub.
          const existingObjects = state[type];
          const newObjects = action.objects[type];
          // For some reason these two lines, with the types, makes the whole thing crash.
          // const existingObjects: { [string]: { _mode: string } } = state[type];
          // const newObjects: { [string]: { _mode: string } } = action.objects[type];

          const newObjectsFiltered = Object.keys(newObjects) // This converts {[id]:{}} to Array<id>
            .filter(id => (
              existingObjects[id] === undefined // Object didn't exist, we copy it (return true)
              || objectModeLevels[newObjects[id]] >= objectModeLevels[existingObjects[id]]) // Object has the same or higher level of detail
            )
            .reduce((ret, id) => Object.assign(ret, {[id]: newObjects[id]}), {}); // This converts Array<id> back to {[id]:{}}

          newState[type] = Object.assign({}, existingObjects, newObjectsFiltered);
        }

      return newState;

    default:
      return state
  }
};

export default objects;
