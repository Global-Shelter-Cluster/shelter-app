// @flow

import {combineReducers} from 'redux';
import online from './online';
import initializing from './initializing';
import groups from './groups';
import user from './user';

export default combineReducers({
  online,
  initializing,
  groups,
  user,
});
