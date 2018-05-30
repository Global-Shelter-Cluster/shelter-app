// @flow

import type {UserData} from "../reducers/user";
import persist from "../persist";
import {NetInfo} from 'react-native';

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

export const SET_USER_DATA = 'SET_USER_DATA';
export const setUserData = (userData: UserData | null) => ({
  type: SET_USER_DATA,
  userData,
});

export const LOGIN = 'LOGIN';
export const login = (user: string, pass: string) => async dispatch => {
  function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  console.log('logging in with user ', user, ' and pwd ', pass);
  await timeout(1000);
  console.log('logged in');
  const userData = {
    id: 123,
    updated: 12345678, //timestamp
    groups: [10, 11],
    username: "Camilo Bravo",
  };
  dispatch(setUserData(userData));
  persist.saveUserData(userData);
};

export const LOGOUT = 'LOGOUT';
export const logout = () => async dispatch => {
  dispatch(setUserData(null));
  persist.clearAll();
};

export const INITIALIZE = 'INITIALIZE';
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
