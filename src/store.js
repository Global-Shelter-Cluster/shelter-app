// @flow

import {applyMiddleware, createStore} from 'redux';
import rootReducer from './reducers';
import thunk from 'redux-thunk';
import config from "./config";

const middlewares = [thunk];

if (config.reduxLogger) {
  const {logger} = require(`redux-logger`);
  middlewares.push(logger);
}

export default createStore(
  rootReducer,
  applyMiddleware(...middlewares)
);
