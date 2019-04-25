// @flow

import {CLEAR_ALL_OBJECTS, SET_OBJECTS} from "../actions";
import type {Objects} from "../model";
import {detailLevels, initialObjectsState, OBJECT_MODE_PUBLIC} from "../model";
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

      if (action.objects)
        for (const type in state) {
          // Don't replace non-stub objects with stubs (see OBJECT_MODE_* consts in model/index.js).
          const existingObjects = state[type];
          const newObjects = action.objects[type];
          if (!newObjects)
            continue;

          const newObjectsFiltered = {};
          for (const id of Object.keys(newObjects)) {
            if (typeof newObjects[id] !== 'object' || newObjects[id] === null)
              continue;

            if (
              detailLevels[newObjects[id]._mode] < detailLevels[OBJECT_MODE_PUBLIC]
              && existingObjects[id] !== undefined
              && detailLevels[newObjects[id]._mode] < detailLevels[existingObjects[id]._mode]
            )
              continue;

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
