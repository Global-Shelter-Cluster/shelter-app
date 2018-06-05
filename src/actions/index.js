// @flow

import persist from "../persist";
import {NetInfo} from 'react-native';
import type {Objects} from "../model";

export const CHANGE_ONLINE_STATUS = 'CHANGE_ONLINE_STATUS';
export const changeOnlineStatus = (isOnline: boolean) => ({
  type: CHANGE_ONLINE_STATUS,
  isOnline,
});

export const CHANGE_INITIALIZING = 'CHANGE_INITIALIZING';
export const changeInitializing = (isInitializing: boolean) => ({
  type: CHANGE_INITIALIZING,
  isInitializing,
});

export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const setCurrentUser = (id: number | null) => ({
  type: SET_CURRENT_USER,
  id,
});

export const SET_OBJECTS = 'SET_OBJECTS';
export const setObjects = (objects: Objects) => ({
  type: SET_OBJECTS,
  objects,
});

export const CLEAR_ALL_OBJECTS = 'CLEAR_ALL_OBJECTS';
export const clearAllObjects = () => ({
  type: CLEAR_ALL_OBJECTS,
});

export const login = (user: string, pass: string) => async () => persist.login(user, pass);

export const loadObject = (type: string, id: number, recursive: boolean, forceRemoteLoad: boolean) => async (dispatch, getState) => {
  try {
    await persist.loadObjects([{type: type, id: id}], recursive, forceRemoteLoad);
  } catch (e) {
    dispatch(setLastError('object-load', {type: type, id: id}));
  }
};

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
  persist.clearAll();
};

export const initialize = () => async dispatch => {
  console.log('initializing...');

  // Update "online" state based on device connection.
  // See https://facebook.github.io/react-native/docs/netinfo.html
  const connectionInfoHandler = connectionInfo => dispatch(changeOnlineStatus(connectionInfo.type !== 'none'));
  const connectionInfo = await NetInfo.getConnectionInfo();
  connectionInfoHandler(connectionInfo);
  NetInfo.addEventListener('connectionChange', connectionInfoHandler);

  // Initialize persist object (loads user object if already logged in)
  await persist.init();
  console.log('...initialized');

  dispatch(changeInitializing(false));
};

export const REFRESH_OLD_DATA = 'REFRESH_OLD_DATA';
export const refreshOldData = () => {

};
