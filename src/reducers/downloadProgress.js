// @flow

import {ADD_FILES_TO_DOWNLOAD, ONE_FILE_DOWNLOADED} from "../actions";
import type {ObjectFileDescription} from "../persist";
import clone from "clone";

export type downloadProgressType = {
  downloadingCount: number,
  filesLeft: Array<ObjectFileDescription>,
}

const downloadProgress = (state: downloadProgressType = {
  downloadingCount: 0,
  filesLeft: [],
}, action: { type: string, files: Array<ObjectFileDescription> }) => {
  switch (action.type) {
    case ADD_FILES_TO_DOWNLOAD: {
      const newState: downloadProgressType = clone(state);

      const toAdd = action.files
        .filter(f => newState.filesLeft.filter(f2 => f2.url === f.url).length === 0); // skip if already in the queue

      newState.downloadingCount += toAdd.length;
      newState.filesLeft.push(...toAdd);

      return newState;
    }
    case ONE_FILE_DOWNLOADED: {
      const newState: downloadProgressType = clone(state);
      newState.filesLeft.shift();

      if (newState.filesLeft.length === 0)
        newState.downloadingCount = 0;

      return newState;
    }
    default:
      return state
  }
};

export default downloadProgress;
