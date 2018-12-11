// @flow

import {
  ADD_ASSESSMENT_FORM_SUBMISSION,
  ADD_FILES_TO_DOWNLOAD,
  ONE_ASSESSMENT_FORM_SUBMITTED,
  ONE_FILE_DOWNLOADED
} from "../actions";
import type {AssessmentFormType, ObjectFileDescription} from "../persist";
import clone from "clone";
import {CLEAR_ALL_DOWNLOADS} from "../actions/index";

export type bgProgressType = {
  totalCount: number,
  operationsLeft: number,
  currentOperation: null | "file" | "assessment",
  filesLeft: Array<ObjectFileDescription>,
  assessmentFormSubmissions: Array<{ type: AssessmentFormType, id: number, values: {} }>,
}

const getCurrentOperation = (state: bgProgressType): string => {
  if (state.assessmentFormSubmissions.length > 0) {
    return "assessment";
  } else if (state.filesLeft.length > 0) {
    return "file";
  }
  return ""; // It's important than we only return an empty string when there's nothing left to do.
};

const bgProgress = (state: bgProgressType = {
    totalCount: 0,
    operationsLeft: 0,
    currentOperation: "",
    filesLeft: [],
    assessmentFormSubmissions: [],
  }, action: {
    type: string,
    files?: Array<ObjectFileDescription>,
    submission?: { type: AssessmentFormType, id: number, values: {} },
  }) => {
    switch (action.type) {
      case ADD_FILES_TO_DOWNLOAD: {
        const newState: bgProgressType = clone(state);

        const toAdd = action.files
          .filter(f => newState.filesLeft.filter(f2 => f2.url === f.url).length === 0); // skip if already in the queue

        newState.filesLeft.push(...toAdd);
        newState.totalCount += toAdd.length;
        newState.operationsLeft += toAdd.length;
        newState.currentOperation = getCurrentOperation(newState);

        return newState;
      }
      case ONE_FILE_DOWNLOADED: {
        const newState: bgProgressType = clone(state);
        newState.filesLeft.shift();

        newState.operationsLeft--;
        newState.currentOperation = getCurrentOperation(newState);
        if (newState.currentOperation === "") {
          newState.totalCount = 0; // reset to 0
          newState.operationsLeft = 0; // this is just in case
        }

        return newState;
      }
      case ADD_ASSESSMENT_FORM_SUBMISSION: {
        const newState: bgProgressType = clone(state);

        newState.assessmentFormSubmissions.push(action.submission);
        newState.totalCount++;
        newState.operationsLeft++;
        newState.currentOperation = getCurrentOperation(newState);

        return newState;
      }
      case ONE_ASSESSMENT_FORM_SUBMITTED: {
        const newState: bgProgressType = clone(state);
        newState.assessmentFormSubmissions.shift();

        newState.operationsLeft--;
        newState.currentOperation = getCurrentOperation(newState);
        if (newState.currentOperation === "") {
          newState.totalCount = 0; // reset to 0
          newState.operationsLeft = 0; // this is just in case
        }

        return newState;
      }
      case CLEAR_ALL_DOWNLOADS: {
        return {
          totalCount: 0,
          operationsLeft: 0,
          currentOperation: "",
          filesLeft: [],
          assessmentFormSubmissions: [],
        };
      }
      default:
        return state
    }
  }
;

export default bgProgress;
