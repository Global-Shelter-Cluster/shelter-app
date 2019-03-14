// @flow

import {applyMiddleware, createStore} from 'redux';
import rootReducer from './reducers';
import thunk from 'redux-thunk';
import config from "./config";
import i18n from "./i18n";

const middlewares = [thunk, i18n.subscribe];

if (config.reduxLogger) {
  const {logger} = require(`redux-logger`);
  middlewares.push(logger);
}

export default createStore(
  rootReducer,
  applyMiddleware(...middlewares)
);
