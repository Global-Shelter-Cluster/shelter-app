// @flow

import {combineReducers} from 'redux';
import flags from './flags';
import objects from './objects';
import seen from './seen';
import currentUser from './currentUser';
import lastError from './lastError';
import bgProgress from './bgProgress';
import files from './files';

export default combineReducers({
  flags,
  objects,
  seen,
  currentUser,
  lastError,
  bgProgress,
  files,
});
