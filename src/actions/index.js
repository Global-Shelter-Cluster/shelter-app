// @flow

export const CHANGE_ONLINE_STATUS = 'CHANGE_ONLINE_STATUS';

export const changeOnlineStatus = (isOnline: boolean) => ({
  type: CHANGE_ONLINE_STATUS,
  isOnline: isOnline,
});
