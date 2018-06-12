// @flow

import {combineReducers} from 'redux';
import flags from './flags';
import objects from './objects';
import currentUser from './currentUser';
import lastError from './lastError';
import downloadProgress from './downloadProgress';
import files from './files';

export default combineReducers({
  flags,
  objects,
  currentUser,
  lastError,
  downloadProgress,
  files,
});
