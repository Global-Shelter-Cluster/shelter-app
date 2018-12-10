// @flow

import {ADD_FILES_TO_DOWNLOAD, ONE_FILE_DOWNLOADED} from "../actions";
import type {ObjectFileDescription} from "../persist";
import clone from "clone";
import {CLEAR_ALL_DOWNLOADS} from "../actions/index";

export type bgProgressType = {
  totalCount: number,
  filesLeft: Array<ObjectFileDescription>,
}

const bgProgress = (state: bgProgressType = {
  totalCount: 0,
  filesLeft: [],
}, action: { type: string, files: Array<ObjectFileDescription> }) => {
  switch (action.type) {
    case ADD_FILES_TO_DOWNLOAD: {
      const newState: bgProgressType = clone(state);

      const toAdd = action.files
        .filter(f => newState.filesLeft.filter(f2 => f2.url === f.url).length === 0); // skip if already in the queue

      newState.totalCount += toAdd.length;
      newState.filesLeft.push(...toAdd);

      return newState;
    }
    case ONE_FILE_DOWNLOADED: {
      const newState: bgProgressType = clone(state);
      newState.filesLeft.shift();

      if (newState.filesLeft.length === 0)
        newState.totalCount = 0;

      return newState;
    }
    case CLEAR_ALL_DOWNLOADS: {
      return {
        totalCount: 0,
        filesLeft: [],
      };
    }
    default:
      return state
  }
};

export default bgProgress;
