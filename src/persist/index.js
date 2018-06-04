// @flow

import {AsyncStorage} from 'react-native';
import {setCurrentUser, setObjects} from "../actions/index";
import type {Store} from "redux";
import Remote from "./remote";
import type {Objects} from "../model";
import Model from "../model";

export type ObjectRequest = {
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

  static now() {
    return Math.floor(Date.now() / 1000);
  }

  async init() {
    this.remote = new Remote;

    try {
      const currentUserId: string | null = await AsyncStorage.getItem(Persist.cacheKey('currentUser'));
      if (currentUserId === null)
        return;
      const id: number = parseInt(currentUserId, 10);
      await this.loadObjects([{type: "user", id: id}], true);
      await this.store.dispatch(setCurrentUser(id));
    } catch (e) {
    }
  }

  saveObjects(objects: Objects, resetLastRead: boolean = false) {
    const data = [];
    for (const type in objects) {
      for (const id in objects[type]) {
        if (resetLastRead) {
          objects[type][id]._last_read = Persist.now();
        }

        data.push([Persist.cacheKey(type, id), JSON.stringify(objects[type][id])]);
      }
    }

    AsyncStorage.multiSet(data);
  }

  clearAll() {
    AsyncStorage.clear();
  }

  async login(user: string, pass: string) {
    // Always get user data from remote on login
    const objects = await this.remote.login(user, pass);

    // Save everything we received (user object, groups, etc.)
    this.saveObjects(objects, true);
    this.dispatchObjects(objects);

    // Now set the current user id
    const currentUserId = parseInt(Object.keys(objects.user)[0], 10);
    AsyncStorage.setItem(Persist.cacheKey('currentUser'), '' + currentUserId);
    this.store.dispatch(setCurrentUser(currentUserId));
  }

  async dispatchObjects(objects: Objects) {
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
   *
   * If called with recursive=true, this will also load all related objects.
   */
  async loadObjects(requests: Array<ObjectRequest>, recursive: boolean = false, forceRemoteLoad: boolean = false) {
    const convertItem = item => ({
      type: item[0].split(':').splice(-2, 1)[0], // Next to last part in cache key (e.g. "@Shelter:user:123")
      id: item[0].split(':').slice(-1)[0], // Last part
      object: JSON.parse(item[1]),
    });

    const loaded = (await AsyncStorage.multiGet(requests.map(o => Persist.cacheKey(o.type, o.id)))).map(convertItem);

    if (loaded.length) {
      if (recursive) {
        let continueLoop = true; // When nothing was done on the loop, this is set to false
        let iterations = 10; // Limit the number of times we do this to prevent an infinite loop (which shouldn't happen anyway)

        do {
          const allRelatedRequests: Array<ObjectRequest> = [];
          const countBeforeProcessing = requests.length;

          loaded.map(item => {
            let relatedRequests = Model.getRelated(item.type, item.object);

            relatedRequests = relatedRequests
              .filter((relatedRequest: ObjectRequest) => {
                for (const request of requests) {
                  if (relatedRequest.type === request.type && relatedRequest.id === request.id)
                    return false; // Already in the original "requests"
                }
                return true;
              });

            allRelatedRequests.push(...relatedRequests);
            requests.push(...relatedRequests);
          });

          if (allRelatedRequests.length) {
            const temp = await AsyncStorage.multiGet(allRelatedRequests.map(o => Persist.cacheKey(o.type, o.id)));
            loaded.push(...temp.map(convertItem));
          }

          // Continue as long as there were new requests added
          continueLoop = requests.length > countBeforeProcessing;
          // console.debug('Persist.loadObjects(): recursive loop', iterations, Object.assign({}, requests));
        } while (continueLoop && (iterations-- > 0));
      }

      const objects = {};

      loaded
        .map(item => {
          if (objects[item.type] === undefined)
            objects[item.type] = {};

          objects[item.type][item.id] = item.object;
        });

      this.dispatchObjects(objects);
    }

    const now = Persist.now();

    const expired: Array<ObjectRequest> = loaded
      .filter(item => (now - item.object._last_read) > expirationLimitsByObjectType[item.type])
      .map(item => ({type: item.type, id: item.id}));

    const isOnline = this.store.getState().online;
    let loadedExpired = false;

    if (isOnline) {
      const loadImmediately: Array<ObjectRequest> = loaded.length >= requests.length
        ? [] // We don't need to load from remote immediately, or we're offline
        : requests
          .filter(request => {
            for (const item of loaded) {
              if (item.type === request.type && item.id === request.id)
                return false; // This object request was found in "loaded" (i.e. it was loaded), so we exclude it from loadImmediately.
            }
            return true;
          });

      if (loadImmediately.length) {
        loadImmediately.push(...expired); // Might as well load the expired objects in the same call
        loadedExpired = true; // Flag to stop from doing this twice

        const newObjects: Objects = await this.remote.loadObjects(loadImmediately);
        this.saveObjects(newObjects, true);
        this.dispatchObjects(newObjects);
      }
    }

    if (isOnline && !loadedExpired && expired.length) {
      const newObjects: Objects = await this.remote.loadObjects(expired);
      this.saveObjects(newObjects, true);
      this.dispatchObjects(newObjects);
    }
  }

  /**
   * Deletes expired objects, unless they have the "_persist" flag.
   */
  garbageCollect() {
    // TODO
  }
}

const persist = new Persist();

export default persist;
