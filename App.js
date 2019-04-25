// @flow

import React from 'react';
import {Platform, StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import AppContainer from './src/containers/AppContainer';
import persist from "./src/persist";
import store from "./src/store";
import {logout} from "./src/actions";

persist.store = store;

// // TEMP: clear everything (logout, etc)
// persist.clearAll();
// store.dispatch(logout());

if (Platform.OS === 'ios')
  StatusBar.setBarStyle('default');

export default ({exp}) => (
  <Provider store={store}>
    {/*<AppContainer exp={{notification: {data: {title: 'test', link: 'group:pages', id: 97}, origin: 'selected'}}}/>*/}
    <AppContainer exp={exp}/>
  </Provider>
);
