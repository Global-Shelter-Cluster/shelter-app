// @flow

import {AsyncStorage} from 'react-native';
import {setCurrentUser, setObjects} from "../actions/index";
import type {Store} from "redux";
import Remote from "./remote";
import type {Objects} from "../model";
import Model from "../model";
import {FileSystem} from "expo";
import md5 from "md5";

export type ObjectRequest = {
  type: "group" | "user" | "document" | "event" | "factsheet",
  id: number,
}

export type ObjectFileDescription = {
  type: "group" | "user" | "document" | "event" | "factsheet",
  id: number,
  property: string,
  url: string,
}

type Files = {
  [url: string]: {
    filename: string,
    uses: Array<ObjectRequest>,
  }
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
    const files: Array<ObjectFileDescription> = [];

    for (const type in objects) {
      for (const id in objects[type]) {
        if (resetLastRead)
          objects[type][id]._last_read = Persist.now();

        if (objects[type][id]._persist)
          files.push(...Model.getFiles(type, objects[type][id]));

        data.push([Persist.cacheKey(type, id), JSON.stringify(objects[type][id])]);
      }
    }

    AsyncStorage.multiSet(data);

    // We don't add "await" here so it runs in the background.
    this.saveFiles(files);
  }

  // Download and save files, one at a time.
  async saveFiles(files: Array<ObjectFileDescription>) {
    for (const file of files)
      await this.saveFile(file);
  }

  async saveFile(file: ObjectFileDescription) {
    // getExtension() function adapted from https://stackoverflow.com/a/6997591/368864
    const getExtension = url => (url = url
      .substr(1 + url.lastIndexOf("/"))
      .split('?')[0]).split('#')[0]
      .substr(
        url.lastIndexOf(".") === -1
          ? Number.MAX_SAFE_INTEGER
          : url.lastIndexOf(".")
      );

    // 0. Make sure the directory exists
    const dir = FileSystem.documentDirectory + 'persisted';
    const dirInfo = await FileSystem.getInfoAsync(dir);
    if (!dirInfo.exists)
      await FileSystem.makeDirectoryAsync(dir);
    else if (!dirInfo.isDirectory) {
      // Our directory exists as a file. Delete it and create a directory instead.
      await FileSystem.deleteAsync(dir);
      await FileSystem.makeDirectoryAsync(dir);
    }

    // 1. Download and save the file
    const localFilename = md5(file.url) + getExtension(file.url);
    const localUri = dir + '/' + localFilename;

    const fileInfo = await FileSystem.getInfoAsync(localUri);
    if (!fileInfo.exists) {
      try {
        await FileSystem.downloadAsync(file.url, localUri);
      } catch (error) {
        console.error('saveFile(): error downloading file', file.url, error);

        // We couldn't download the file, so we leave the object unmodified in the hopes that the app will be able to
        // read the external uri.
        return;
      }
    }

    // 2. Update "files" data from AsyncStorage
    let files: Files | string | null = await AsyncStorage.getItem(Persist.cacheKey('files'));
    files = typeof files === "string" ? JSON.parse(files) : {};

    const use = {type: file.type, id: file.id};
    if (files[file.url])
      files[file.url].uses.push(use);
    else
      files[file.url] = {
        filename: localFilename,
        uses: [use],
      };

    AsyncStorage.setItem(Persist.cacheKey('files'), JSON.stringify(files));

    // 3. Update the object using the file
    let object = await AsyncStorage.getItem(Persist.cacheKey(file.type, file.id));
    if (object) {
      object = JSON.parse(object);
      object[file.property] = localUri;
      AsyncStorage.setItem(Persist.cacheKey(file.type, file.id), JSON.stringify(object));
      this.dispatchObject(file.type, file.id, object);
    }
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

  async dispatchObject(type: string, id: number, object: {}) {
    this.dispatchObjects({[type]: {[id]: object}});
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
   * Also deletes files that have no objects using them.
   */
  garbageCollect() {
    // TODO
  }
}

const persist = new Persist();

export default persist;
