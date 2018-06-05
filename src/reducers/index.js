// @flow

import {combineReducers} from 'redux';
import online from './online';
import initializing from './initializing';
import objects from './objects';
import currentUser from './currentUser';
import lastError from './lastError';

export default combineReducers({
  online,
  initializing,
  objects,
  currentUser,
  lastError,
});
