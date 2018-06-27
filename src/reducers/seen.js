// @flow

import type {ObjectIds, ObjectType} from "../model";
import {initialObjectIdsState} from "../model";
import clone from 'clone';
import {ADD_SEEN_OBJECT, REPLACE_ALL_SEEN_OBJECTS} from "../actions";

const seen = (state: ObjectIds = initialObjectIdsState, action: { type: string, objectType?: ObjectType, id?: number, objectIds?: ObjectIds }) => {
  switch (action.type) {
    case ADD_SEEN_OBJECT:
      if (action.objectType === undefined || action.id === undefined)
        return state;

      if (state[action.objectType] !== undefined && state[action.objectType].indexOf(action.id) !== -1)
        return state; // This object is already marked as seen

      const ret = clone(state);

      if (ret[action.objectType] === undefined)
        ret[action.objectType] = [];

      ret[action.objectType].push(action.id);

      return ret;

    case REPLACE_ALL_SEEN_OBJECTS:
      return action.objectIds;

    default:
      return state
  }
};

export default seen;
