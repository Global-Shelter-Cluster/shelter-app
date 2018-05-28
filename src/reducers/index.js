// @flow

import {combineReducers} from 'redux';
import online from './online';
import groups from './groups';
import user from './user';

export default combineReducers({
  online,
  groups,
  user,
});
