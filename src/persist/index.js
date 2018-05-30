// @flow

import {AsyncStorage} from 'react-native';
import {setCurrentUser, setObjects} from "../actions/index";
import type {UserData} from "../reducers/user";
import type {Store} from "redux";
import Remote from "./remote";
import Model from "../model";
import type {Objects} from "../reducers/objects";

export interface ObjectRequest {
  type: "group" | "user" | "document" | "event" | "factsheet",
  id: number,
}

const expirationLimitsByObjectType = { // 3600s = 1hr
  "group": 3600,
  "user": 3600,
  "document": 3600 * 24,
  "event": 3600 * 24,
  "factsheet": 3600 * 24,
};

/**
 * Class Persist.
 *
 * Saves and loads data from AsyncStorage ("save*, load*" functions).
 * Communicates with the Remote class for getting data it doesn't have.
 * Calls dispatch() on the redux store for sending data to the app ("dispatch*" functions).
 * Is not allowed to talk to the app directly.
 */
class Persist {
  store: Store;
  remote: Remote;

  static cacheKey(...elements: Array<string | number>) {
    return ['@Shelter', ...elements].join(':');
  }

  async init() {
    this.remote = new Remote;

    try {
      const currentUserId: string = await AsyncStorage.getItem(Persist.cacheKey('currentUser'));
      if (currentUserId === null)
        return;
      const id: number = parseInt(currentUserId, 10);
      const currentUserData: string = await AsyncStorage.getItem(Persist.cacheKey('user', id));
      await this.dispatchObjects({users: {[id]: JSON.parse(currentUserData)}});
      await this.store.dispatch(setCurrentUser(id));
    } catch (e) {
    }
  }

  saveUserData(id: number, data: UserData) {
    AsyncStorage.multiSet([
      [Persist.cacheKey('currentUser'), '' + id],
      [Persist.cacheKey('user', id), JSON.stringify(data)],
    ]);
  }

  clearAll() {
    AsyncStorage.clear();
  }

  async login(user: string, pass: string) {
    // Always get user data from remote on login
    const userData = await this.remote.loginAndGetUserData(user, pass);
    this.saveUserData(userData.id, userData);

    this.dispatchObjects({users: {[userData.id]: userData}}, false); // TODO: change 'deep' param to true
    this.store.dispatch(setCurrentUser(userData.id));
    // this.dispatchUserData(userData);
  }

  async dispatchObjects(objects: Objects, deep: boolean = false) {
    if (deep) {
      const toLoad: Array<ObjectRequest> = [];
      for (const type in objects) {
        for (const object of objects[type])
          toLoad.push(...Model.getChildren(type, object));
      }
    }
    this.store.dispatch(setObjects(objects));
  }

  async dispatchUserData(userData: UserData) {
    // Load all data on followed groups
    // this.loadObjects()
    // userData.groups
    console.log('diUD', userData);

    this.store.dispatch(setCurrentUser(userData));
  }

  async loadObjects(objects: Array<ObjectRequest>, forceRemoteLoad: boolean = false) {
    const loaded = await AsyncStorage.multiGet(objects.map(o => Persist.cacheKey(o.type, o.id)));

    console.log('loadObjects(), loaded:', loaded);
    // this.store.dispatch(setObjects(loaded));

    if (this.store.getState().online) {

    }
  }
}

const persist = new Persist();

export default persist;
