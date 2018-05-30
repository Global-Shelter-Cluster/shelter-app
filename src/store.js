// @flow

import {applyMiddleware, createStore} from 'redux';
import rootReducer from './reducers';
import thunkMiddleware from 'redux-thunk';

const middlewares = [thunkMiddleware];

if (process.env.NODE_ENV === `development`) {
  const {logger} = require(`redux-logger`);
  middlewares.push(logger);
}

export default createStore(
  rootReducer,
  applyMiddleware(...middlewares)
);
