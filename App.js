// @flow

import React from 'react';
import {applyMiddleware, createStore} from 'redux';
import {Provider} from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './src/reducers';
import AppContainer from './src/containers/AppContainer';
import persist from "./src/persist";

const middlewares = [thunkMiddleware];

if (process.env.NODE_ENV === `development`) {
  const {logger} = require(`redux-logger`);
  middlewares.push(logger);
}

const store = createStore(
  rootReducer,
  applyMiddleware(...middlewares)
);

persist.store = store;
persist.init();

export default () => (
  <Provider store={store}>
    <AppContainer/>
  </Provider>
);
