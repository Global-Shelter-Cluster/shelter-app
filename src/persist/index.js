// @flow

import {AsyncStorage} from 'react-native';
import {setUserData} from "../actions/index";
import type {UserData} from "../reducers/user";
import type {Store} from "redux";

class Persist {
  store: Store;

  init() {
    AsyncStorage.getItem('@Shelter:userData').then((userData: UserData) => {
      if (userData === null)
        return;

      this.store.dispatch(setUserData(JSON.parse(userData)));
    });
  }

  saveUserData(userData: UserData) {
    AsyncStorage.setItem('@Shelter:userData', JSON.stringify(userData));
  }

  clearAll() {
    AsyncStorage.clear();
  }
}

const persist = new Persist();

export default persist;
