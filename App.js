// @flow

import React from 'react';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import rootReducer from './src/reducers';
import App from './src/components/App';

const store = createStore(rootReducer);

export default () => (
  <Provider store={store}>
    <App/>
  </Provider>
);
