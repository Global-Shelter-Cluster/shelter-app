// @flow

import {CLEAR_ALL_OBJECTS, SET_OBJECTS} from "../actions";
import type {Objects} from "../model";
import {initialObjectsState, OBJECT_MODE_STUB, OBJECT_MODE_STUBPLUS} from "../model";
import clone from 'clone';

const objects = (state: Objects = initialObjectsState, action: { type: string, objects?: Objects, replaceAll?: boolean }) => {
  switch (action.type) {
    case CLEAR_ALL_OBJECTS:
      return initialObjectsState;

    case SET_OBJECTS:
      if (action.replaceAll) {
        const ret = clone(initialObjectsState);

        for (const i in action.objects)
          ret[i] = clone(action.objects[i]);

        return ret;
      }

      const newState = Object.assign({}, state); // copies references to the actual objects

      const filterFn = (id, existingObjects, newObjects) => (
        existingObjects[id] === undefined // Object didn't exist, we copy it (return true)
        || !( // Don't replace non-stub objects with stubs
          (newObjects[id]._mode === OBJECT_MODE_STUB || newObjects[id]._mode === OBJECT_MODE_STUBPLUS)
          && (existingObjects[id]._mode !== OBJECT_MODE_STUB && existingObjects[id]._mode !== OBJECT_MODE_STUBPLUS)
        )
      );

      if (action.objects)
        for (const type in state) {
          // Don't replace non-stub objects with stubs (see OBJECT_MODE_* consts in model/index.js).
          const existingObjects = state[type];
          const newObjects = action.objects[type];
          if (!newObjects)
            continue;

          // For some reason these two lines, with the types, makes the whole thing crash.
          // const existingObjects: { [string]: { _mode: string } } = state[type];
          // const newObjects: { [string]: { _mode: string } } = action.objects[type];

          const filteredIds = Object.keys(newObjects) // This converts {[id]:{}} to Array<id>
            .filter(filterFn, existingObjects, newObjects)

          const newObjectsFiltered = {};
          for (const id of filteredIds) {
            newObjectsFiltered[id] = clone(newObjects[id]);
            if (
              existingObjects[id] !== undefined
              && (existingObjects[id]._persist !== undefined && existingObjects[id]._persist)
              && (newObjects[id]._persist === undefined || !newObjects[id]._persist)
            )
              newObjectsFiltered[id]._persist = true;
          }

          newState[type] = Object.assign({}, existingObjects, newObjectsFiltered);
        }

      return newState;

    default:
      return state
  }
};

export default objects;
