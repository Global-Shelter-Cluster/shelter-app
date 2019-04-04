// @flow

import React from 'react';
import {Provider} from 'react-redux';
import AppContainer from './src/containers/AppContainer';
import persist from "./src/persist";
import store from "./src/store";
import {logout} from "./src/actions";

persist.store = store;

// // TEMP: clear everything (logout, etc)
// persist.clearAll();
// store.dispatch(logout());

export default ({exp}) => (
  <Provider store={store}>
    <AppContainer exp={exp}/>
  </Provider>
);
