// @flow

import React from 'react';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './src/reducers';
import AppContainer from './src/containers/AppContainer';

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware
  )
);

export default () => (
  <Provider store={store}>
    <AppContainer/>
  </Provider>
);
