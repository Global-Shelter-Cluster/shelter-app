// @flow

import {combineReducers} from 'redux';
import online from './online';
import initializing from './initializing';
import objects from './objects';
import currentUser from './currentUser';

export default combineReducers({
  online,
  initializing,
  objects,
  currentUser,
});
