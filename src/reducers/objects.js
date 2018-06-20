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

          const newObjectsFiltered = Object.keys(newObjects) // This converts {[id]:{}} to Array<id>
            .filter(id => (
              existingObjects[id] === undefined // Object didn't exist, we copy it (return true)
              || !( // Don't replace non-stub objects with stubs
                (newObjects[id]._mode === OBJECT_MODE_STUB || newObjects[id]._mode === OBJECT_MODE_STUBPLUS)
                && (existingObjects[id]._mode !== OBJECT_MODE_STUB && existingObjects[id]._mode !== OBJECT_MODE_STUBPLUS)
              )
            ))
            .reduce((ret, id) => {
              // If a new object comes without the "_persist" flag, but an existing one has it, we add it so we don't lose
              // the object on garbage collection.
              const addPersistFlag = existingObjects[id] && existingObjects[id]._persist && !newObjects[id]._persist;

              return Object.assign(
                ret,
                {[id]: Object.assign({}, newObjects[id], addPersistFlag ? {_persist: true} : null)}
              );
            }, {}); // Converted Array<id> back to {[id]:{}}

          newState[type] = Object.assign({}, existingObjects, newObjectsFiltered);
        }

      return newState;

    default:
      return state
  }
};

export default objects;
