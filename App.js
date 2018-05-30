// @flow

import React from 'react';
import {Provider} from 'react-redux';
import AppContainer from './src/containers/AppContainer';
import persist from "./src/persist";
import store from "./src/store";

persist.store = store;

export default () => (
  <Provider store={store}>
    <AppContainer/>
  </Provider>
);
