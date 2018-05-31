// @flow

import {AsyncStorage} from 'react-native';
import {setCurrentUser, setObjects} from "../actions/index";
import type {UserData} from "../reducers/user";
import type {Store} from "redux";
import Remote from "./remote";
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

const lastReadPropertyName = '_last_read';

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
      const currentUserId: string | null = await AsyncStorage.getItem(Persist.cacheKey('currentUser'));
      if (currentUserId === null)
        return;
      const id: number = parseInt(currentUserId, 10);
      const currentUserData: string | null = await AsyncStorage.getItem(Persist.cacheKey('user', id));
      if (currentUserData === null)
        return;
      await this.dispatchObjects({user: {[id]: JSON.parse(currentUserData)}});
      await this.store.dispatch(setCurrentUser(id));
    } catch (e) {
    }
  }

  saveObjects(objects: Objects, resetLastRead: boolean = false) {
    const data = [];
    for (const type in objects) {
      for (const id in objects[type]) {
        if (resetLastRead) {
          objects[type][id][lastReadPropertyName] = Math.floor(Date.now() / 1000);
        }

        data.push([Persist.cacheKey(type, id), JSON.stringify(objects[type][id])]);
      }
    }

    console.log('saveObjects data', data);
    AsyncStorage.multiSet(data);
    // AsyncStorage.multiSet([
    //   [Persist.cacheKey('currentUser'), '' + id],
    //   [Persist.cacheKey('user', id), JSON.stringify(data)],
    // ]);
  }

  clearAll() {
    AsyncStorage.clear();
  }

  async login(user: string, pass: string) {
    // Always get user data from remote on login
    const objects = await this.remote.login(user, pass);

    // Save everything we received (user object, groups, etc.)
    this.saveObjects(objects, true);
    this.dispatchObjects(objects, true);

    // Now set the current user id
    const currentUserId = parseInt(Object.keys(objects.user)[0], 10);
    AsyncStorage.setItem(Persist.cacheKey('currentUser'), '' + currentUserId);
    this.store.dispatch(setCurrentUser(currentUserId));
  }

  // If recursiveLoadFirst is true, first loads any objects related to the ones received.
  async dispatchObjects(objects: Objects, recursiveLoadFirst: boolean = false) {
    if (recursiveLoadFirst) {
      // const toLoad: Array<ObjectRequest> = [];
      // for (const type in objects) {
      //   for (const object of objects[type])
      //     toLoad.push(...Model.getChildren(type, object));
      // }
    }
    console.log('about to dispatch objects', objects);
    this.store.dispatch(setObjects(objects));
  }

  /**
   * Loads objects from AsyncStorage and puts them into the store.
   *
   * If it can't find any of them, it first loads the ones that are missing from the remote server.
   *
   * Triggers a remote load for expired ones. If every object was found in AsyncStorage, this happens asynchronously
   * after the objects are dispatched.
   *
   * If currently offline, dispatches only the objects it can find on AsyncStorage.
   */
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
