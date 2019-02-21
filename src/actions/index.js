// @flow

import type {
  AssessmentFormSubmission,
  AssessmentFormType,
  Files,
  ObjectFileDescription,
  ObjectRequest
} from "../persist";
import persist from "../persist";
import {NetInfo} from 'react-native';
import type {ObjectIds, Objects, ObjectType} from "../model";
import config from "../config";
import type {flags} from "../reducers/flags";
import type {newAccountValues} from "../screens/auth/Signup";
import type {notificationType} from "../reducers/notification";
import type {localVarsTypeAllOptional} from "../reducers/localVars";

export const CHANGE_FLAG = 'CHANGE_FLAG';
export const changeFlag = (flag: flags, value: boolean) => ({
  type: CHANGE_FLAG,
  flag,
  value,
});

export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const setCurrentUser = (id: number | null) => ({
  type: SET_CURRENT_USER,
  id,
});

export const SET_OBJECTS = 'SET_OBJECTS';
export const setObjects = (objects: Objects, replaceAll: boolean = false) => ({
  type: SET_OBJECTS,
  objects,
  replaceAll,
});

export const CLEAR_ALL_OBJECTS = 'CLEAR_ALL_OBJECTS';
export const clearAllObjects = () => ({
  type: CLEAR_ALL_OBJECTS,
});

export const login = (user: string, pass: string) => async dispatch => {
  dispatch(clearLastError());
  dispatch(changeFlag("loggingIn", true));
  try {
    await persist.login(user, pass);
  } catch (e) {
    dispatch(setLastError('login-error', {message: e.message}));
  }
  dispatch(changeFlag("loggingIn", false));
};

export const signup = (newAccountValues: newAccountValues) => async dispatch => {
  dispatch(clearLastError());
  dispatch(changeFlag("loggingIn", true));
  try {
    await persist.signup(newAccountValues);
  } catch (e) {
    dispatch(setLastError('signup-error', {message: e.message}));
  }
  dispatch(changeFlag("loggingIn", false));
};

export const requestNewPassword = (value: string) => async dispatch => {
  dispatch(clearLastError());
  dispatch(changeFlag("loggingIn", true)); // We use this flag here even if it doesn't make much sense.
  try {
    await persist.requestNewPassword(value);
  } catch (e) {
    dispatch(setLastError('request-new-password-error', {message: e.message}));
  }
  dispatch(changeFlag("loggingIn", false));
};

export const loadObject = (type: ObjectType, id: number, recursive: boolean, forceRemoteLoad: boolean) => async dispatch => {
  dispatch(changeFlag('loading', true));
  try {
    await persist.loadObjects([{type: type, id: id}], recursive, forceRemoteLoad);
  } catch (e) {
    dispatch(setLastError('object-load', {type: type, id: id}));
  }
  dispatch(changeFlag('loading', false));
};

// // If this fails, we'll run "setLastError" using the first item from "requests"
// export const loadObjects = (requests: Array<ObjectRequest>, recursive: boolean, forceRemoteLoad: boolean) => async dispatch => {
//   dispatch(changeFlag('loading', true));
//   try {
//     await persist.loadObjects(requests, recursive, forceRemoteLoad);
//   } catch (e) {
//     dispatch(setLastError('object-load', {type: requests[0].type, id: requests[0].id}));
//   }
//   dispatch(changeFlag('loading', false));
// };

export const loadCurrentUser = (recursive: boolean, forceRemoteLoad: boolean) => async (dispatch, getState) => {
  const id = getState().currentUser;
  if (!id)
    return;

  dispatch(changeFlag('loading', true));
  try {
    await persist.loadObjects([{type: 'user', id: id}], recursive, forceRemoteLoad);
  } catch (e) {
    dispatch(setLastError('object-load', {type: 'user', id: id}));
  }
  dispatch(changeFlag('loading', false));
};

export const followGroup = (id: number) => async dispatch => {
  dispatch(changeFlag('following', true));
  try {
    await persist.followGroup(id);
  } catch (e) {
    dispatch(setLastError('object-load', {type: 'group', id: id}));
  }
  dispatch(changeFlag('following', false));
};

export const unfollowGroup = (id: number) => async dispatch => {
  dispatch(changeFlag('following', true));
  try {
    await persist.unfollowGroup(id);
  } catch (e) {
    dispatch(setLastError('object-load', {type: 'group', id: id}));
  }
  dispatch(changeFlag('following', false));
};

export const markSeen = (objectType: ObjectType, id: number) => async dispatch => {
  dispatch(addSeenObject(objectType, id));
  await persist.saveSeen();
};

export const ADD_SEEN_OBJECT = 'ADD_SEEN_OBJECT';
const addSeenObject = (objectType: ObjectType, id: number) => ({
  type: ADD_SEEN_OBJECT,
  objectType: objectType,
  id,
});

export const REPLACE_ALL_SEEN_OBJECTS = 'REPLACE_ALL_SEEN_OBJECTS';
export const replaceAllSeenObjects = (objectIds: ObjectIds) => ({
  type: REPLACE_ALL_SEEN_OBJECTS,
  objectIds,
});

export const SET_LAST_ERROR = 'SET_LAST_ERROR';
export const setLastError = (type: string, data: {}) => ({
  type: SET_LAST_ERROR,
  data: {type, data},
});

export const CLEAR_LAST_ERROR = 'CLEAR_LAST_ERROR';
export const clearLastError = () => ({
  type: CLEAR_LAST_ERROR,
});

export const logout = () => async dispatch => {
  dispatch(setCurrentUser(null));
  dispatch(clearAllObjects());
  dispatch(clearAllDownloads());
  dispatch(changeFlag('loggingIn', false));

  try {
    await persist.logout();
  } catch (e) {
    dispatch(setLastError('logout-error', {message: e.message}));
  }

  if (config.deleteFilesOnLogout)
    dispatch(setFiles({}));
  persist.clearAll();
};

export const initialize = () => async dispatch => {
  console.log('initializing...');

  // Update "online" state based on device connection.
  // See https://facebook.github.io/react-native/docs/netinfo.html
  const connectionInfoHandler = connectionInfo => dispatch(changeFlag('online', connectionInfo.type !== 'none'));
  const connectionInfo = await NetInfo.getConnectionInfo();
  connectionInfoHandler(connectionInfo);
  NetInfo.addEventListener('connectionChange', connectionInfoHandler);

  // Initialize persist object (loads user object if already logged in)
  await persist.init();
  console.log('...initialized');

  dispatch(changeFlag('initializing', false));
};

export const REFRESH_OLD_DATA = 'REFRESH_OLD_DATA';
export const refreshOldData = () => {

};

export const downloadFiles = (files: Array<ObjectFileDescription>) => async (dispatch, getState) => {
  if (!config.persistFiles)
    return;

  const existingFiles = getState().files;

  dispatch(addFilesToDownload(files.filter(i => existingFiles[i.url] === undefined)));
  dispatch(processBackgroundTasks());
};

const processBackgroundTasks = () => async (dispatch, getState) => {
  let state = getState();
  if (state.flags.processing)
    return; // We're already processing bg tasks

  dispatch(changeFlag('processing', true));

  const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  let count = 0;

  mainLoop:
    while (state.bgProgress.operationsLeft > 0) {
      while (!state.flags.online) {
        await timeout(5000);
        state = getState();
      }

      switch (state.bgProgress.currentOperation) {
        case "assessment":
          const s = state.bgProgress.assessmentFormSubmissions[0];
          await persist.submitAssessmentForm(s.type, s.id, s.values);
          await dispatch(oneAssessmentFormSubmitted());
          await persist.savePendingAssessmentFormSubmissions();
          break;

        case "file":
          await persist.saveFile(state.bgProgress.filesLeft[0]);
          dispatch(oneFileDownloaded());
          break;

        default:
          // Something's wrong, let's just stop.
          break mainLoop;
      }

      if (count++ % 20 === 0)
        await timeout(100); // A small pause every 20 items (let the thread breathe)

      state = getState();
    }

  dispatch(changeFlag('processing', false));
};

export const ADD_FILES_TO_DOWNLOAD = 'ADD_FILES_TO_DOWNLOAD';
export const addFilesToDownload = (files: Array<ObjectFileDescription>) => ({
  type: ADD_FILES_TO_DOWNLOAD,
  files,
});

export const ONE_FILE_DOWNLOADED = 'ONE_FILE_DOWNLOADED';
export const oneFileDownloaded = () => ({
  type: ONE_FILE_DOWNLOADED,
});

export const ADD_ASSESSMENT_FORM_SUBMISSION = 'ADD_ASSESSMENT_FORM_SUBMISSION';
export const addAssessmentFormSubmission = (submission: AssessmentFormSubmission) => ({
  type: ADD_ASSESSMENT_FORM_SUBMISSION,
  submission,
});

export const ONE_ASSESSMENT_FORM_SUBMITTED = 'ONE_ASSESSMENT_FORM_SUBMITTED';
export const oneAssessmentFormSubmitted = () => ({
  type: ONE_ASSESSMENT_FORM_SUBMITTED,
});

export const CLEAR_ALL_DOWNLOADS = 'CLEAR_ALL_DOWNLOADS';
export const clearAllDownloads = () => ({
  type: CLEAR_ALL_DOWNLOADS,
});

export const SET_FILES = 'SET_FILES';
export const setFiles = (files: Files) => ({
  type: SET_FILES,
  files: files,
});

export const setFile = (url: string, filename: string, uses: Array<ObjectRequest>) => async (dispatch, getState) => {
  const files = Object.assign({}, getState().files);
  files[url] = {
    filename: filename,
    uses: uses,
  };

  await dispatch(setFiles(files));
  await persist.saveFiles();
};

export const submitAssessmentForm = (type: AssessmentFormType, id: number, values: { [string]: string }) => async (dispatch, getState) => {
  dispatch(clearLastError());

  // Completely different things for when you're online vs. offline
  dispatch(changeFlag('submitting', true));
  if (getState().flags.online) {

    // Send it right away (or try to, anyway)
    try {
      await persist.submitAssessmentForm(type, id, values);
    } catch (e) {
      dispatch(setLastError('assessment-form-submit', {type, id, message: e.message}));
    }

  } else {

    // Let the user know the submission is being queued
    dispatch(setLastError('assessment-form-queued', {type, id}));

    // Put it in the queue
    await dispatch(addAssessmentFormSubmission({type, id, values}));
    await persist.savePendingAssessmentFormSubmissions();
    dispatch(processBackgroundTasks());

  }
  dispatch(changeFlag('submitting', false));
};

export const SET_NOTIFICATION = 'SET_NOTIFICATION';
export const setNotification = (notification: notificationType) => ({
  type: SET_NOTIFICATION,
  notification,
});

export const CLEAR_NOTIFICATION = 'CLEAR_NOTIFICATION';
export const clearNotification = () => ({
  type: CLEAR_NOTIFICATION,
});

export const saveLocalVars = (localVars: localVarsTypeAllOptional) => async dispatch => {
  dispatch(mergeLocalVars(localVars));
  await persist.saveLocalVars();
};

export const MERGE_LOCAL_VARS = 'MERGE_LOCAL_VARS';
export const mergeLocalVars = (localVars: localVarsTypeAllOptional) => ({
  type: MERGE_LOCAL_VARS,
  localVars,
});
