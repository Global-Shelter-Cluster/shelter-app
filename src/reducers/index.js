// @flow

import {combineReducers} from 'redux';
import online from './online';
import initializing from './initializing';
import objects from './objects';
import currentUser from './currentUser';
import lastError from './lastError';
import downloadProgress from './downloadProgress';

export default combineReducers({
  online,
  initializing,
  objects,
  currentUser,
  lastError,
  downloadProgress,
});
