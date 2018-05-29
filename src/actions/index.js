// @flow

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

export const INITIALIZE = 'INITIALIZE';
export const initialize = () => async dispatch => {
  function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  console.log('A');
  await timeout(1000);
  console.log('B');

  dispatch(changeInitializing(false));
};

export const REFRESH_OLD_DATA = 'REFRESH_OLD_DATA';
export const refreshOldData = () => {

};
