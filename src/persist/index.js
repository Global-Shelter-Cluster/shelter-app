// @flow

import {
  clearAllDownloads,
  downloadFiles,
  replaceAllSeenObjects,
  setCurrentUser,
  setFile,
  setFiles,
  setObjects
} from "../actions";
import type {Store} from "redux";
import Remote from "./remote";
import type {ObjectIds, Objects, ObjectType} from "../model";
import Model, {
  detailLevels,
  expirationLimitsByObjectType,
  initialObjectIdsState,
  OBJECT_MODE_PRIVATE,
  OBJECT_MODE_PUBLIC
} from "../model";
import {FileSystem} from "expo";
import md5 from "md5";
import Storage from "./storage_async";
import config from "../config";
import clone from 'clone';
import {GLOBAL_OBJECT_ID} from "../model/global";
import {getExtension} from "../util";
import type {PrivateUserObject} from "../model/user";
import {getCurrentUser} from "../model/user";

export type ObjectRequest = {
  type: ObjectType,
  id: number,
}

export type ObjectFileDescription = {
  type: ObjectType,
  id: number,
  property: string,
  url: string,
}

export type Files = {
  [url: string]: {
    filename: string,
    uses: Array<ObjectRequest>,
  }
}

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
  directory: string;

  static cacheKey(...elements: Array<string | number>) {
    return ['@Shelter', ...elements].join(':');
  }

  static now() {
    return Math.floor(Date.now() / 1000);
  }

  async init() {
    this.remote = new Remote;
    await this.initDirectory(FileSystem.documentDirectory + 'persisted');

    try {
      const currentUserId: string | null = await Storage.getItem(Persist.cacheKey('currentUser'));
      if (currentUserId === null)
        return;
      const id: number = parseInt(currentUserId, 10);

      const filesString: string | null = await Storage.getItem(Persist.cacheKey('files'));
      if (filesString !== null) {
        const files: Files = JSON.parse(filesString);
        await this.store.dispatch(setFiles(files));
      }

      const seenString: string | null = await Storage.getItem(Persist.cacheKey('seen'));
      if (seenString !== null) {
        const seen: ObjectIds = JSON.parse(seenString);
        await this.store.dispatch(replaceAllSeenObjects(seen));
      }

      await this.loadObjects([
        {type: "global", id: GLOBAL_OBJECT_ID},
        {type: "user", id: id},
      ], true);
      await this.store.dispatch(setCurrentUser(id));
    } catch (e) {
      console.log('Error during initialization', e);
    }
  }

  async initDirectory(directory: string) {
    this.directory = directory;
    const dirInfo = await FileSystem.getInfoAsync(this.directory);

    if (!dirInfo.exists)
      await FileSystem.makeDirectoryAsync(this.directory);
    else if (!dirInfo.isDirectory) {
      // Our directory exists as a file. Delete it and create a directory instead.
      await FileSystem.deleteAsync(this.directory);
      await FileSystem.makeDirectoryAsync(this.directory);
    }
  }

  updateLastRead(objects: Objects) {
    for (const type in objects)
      for (const id in objects[type])
        objects[type][id]._last_read = Persist.now();
  }

  // Saves the objects (and their files) marked with _persist:true to AsyncStorage (and FileSystem).
  saveObjects(objects: Objects) {
    const storedObjects = this.store.getState().objects;

    const data = [];

    for (const type in objects) {
      for (const id in objects[type]) {
        if (!objects[type][id]._persist)
          continue;

        if (
          detailLevels[objects[type][id]._mode] < detailLevels[OBJECT_MODE_PUBLIC]
          && storedObjects[type][id] !== undefined
          && detailLevels[objects[type][id]._mode] < detailLevels[storedObjects[type][id]._mode]
        )
        // Don't store, for example, the current user if it's a stub.
          continue;

        data.push([Persist.cacheKey(type, id), JSON.stringify(objects[type][id])]);
      }
    }

    if (data.length > 0)
      Storage.multiSet(data);

    this.downloadFilesForObjects(objects);
  }

  downloadFilesForObjects(objects: Objects) {
    const files: Array<ObjectFileDescription> = [];

    for (const type in objects) {
      for (const id in objects[type]) {
        if (!objects[type][id]._persist)
          continue;

        files.push(...Model.getFiles(type, objects[type][id]));
      }
    }

    if (files.length > 0)
    // This should run in the background.
      setTimeout(() => this.store.dispatch(downloadFiles(files)), 1000);
  }

  generateLocalFilename(url: string): string {
    let extension = getExtension(url);

    if (!extension && /^https?:\/\/maps\.googleapis\.com\/maps\/api\/staticmap/.test(url))
      extension = '.png';

    return md5(url) + extension;
  }

  async saveFile(file: ObjectFileDescription) {
    // 1. Download and save the file
    const localFilename = this.generateLocalFilename(file.url);
    const localUri = this.directory + '/' + localFilename;

    let fileInfo = await FileSystem.getInfoAsync(localUri);
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
    // Just in case, we check if the downloaded file exists and isn't empty.
    fileInfo = await FileSystem.getInfoAsync(localUri);
    if (!fileInfo.exists || fileInfo.size === 0)
      return;
    console.debug('saveFile(): downloaded file successfully', fileInfo.uri);

    // 2. Update "files" data from state
    let files: Files = this.store.getState().files;

    const use = {type: file.type, id: file.id};
    if (files[file.url]) {
      let found = false;
      for (const existingUse of files[file.url].uses) {
        if (existingUse.type === use.type && existingUse.id === use.id) {
          found = true;
          break;
        }
      }
      if (!found) {
        const newUses: Array<ObjectRequest> = clone(files[file.url].uses);
        newUses.push(use);
        await this.store.dispatch(setFile(file.url, files[file.url].filename, newUses));
      }
    } else
      await this.store.dispatch(setFile(file.url, localFilename, [use]));
  }

  async saveFiles() {
    const files = this.store.getState().files;
    await Storage.setItem(Persist.cacheKey('files'), JSON.stringify(files));
  }

  clearAll(force: boolean = false) {
    Storage.clear();
    this.store.dispatch(replaceAllSeenObjects(initialObjectIdsState));
    console.debug('Cleared storage');
    if (force || config.deleteFilesOnLogout) {
      FileSystem.deleteAsync(this.directory, {idempotent: true}).then(
        () => this.initDirectory(this.directory)
      );
      console.debug('Deleted all files');
    }
  }

  async login(user: string, pass: string) {
    // Always get user data from remote on login
    const results = await this.remote.login(user, pass);
    const objects = results.objects;

    console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&', '\n', results);


    console.log('*************************************************', '\n', '\n');
    // Save everything we received (user object, groups, etc.)
    this.updateLastRead(objects);
    this.saveObjects(objects);
    this.dispatchObjects(objects);

    // Now set the current user id (the only one returned as OBJECT_MODE_PRIVATE).
    for (const id in objects.user) {
      if (objects.user[id]._mode === OBJECT_MODE_PRIVATE) {
        this.store.dispatch(setCurrentUser(parseInt(id, 10)));
        console.debug('Saving current user id...', id);
        await Storage.setItem(Persist.cacheKey('currentUser'), '' + id);
        console.debug('Saving current user id... done.');
        return;
      }
    }

    // No private user returned, something's wrong
    throw new Error("No user returned by login call")
  }

  async followGroup(id: number) {
    // Remote returns the group and related objects
    const objects = await this.remote.followGroup(id);

    const user: PrivateUserObject = clone(getCurrentUser(this.store.getState()));
    if (user.groups === undefined)
      user.groups = [];
    user.groups.push(id);
    if (objects.user === undefined)
      objects.user = {};
    objects.user[user.id] = user;

    // Save everything we received
    this.updateLastRead(objects);
    this.saveObjects(objects);
    this.dispatchObjects(objects);
  }

  async unfollowGroup(id: number) {
    // Remote returns the user and related objects, same as login, so, until we have a better solution, we just delete
    // all objects and save the ones we receive here.
    const objects = await this.remote.unfollowGroup(id);

    // Delete everything in permanent storage.
    await Storage.clear();
    // ...except these.
    Storage.setItem(Persist.cacheKey('currentUser'), '' + this.store.getState().currentUser);
    this.saveFiles();

    this.store.dispatch(clearAllDownloads());

    // Save everything we received (includes the user object)
    this.updateLastRead(objects);
    this.saveObjects(objects);
    this.dispatchObjects(objects, true); // This deletes every object in the store (memory) before saving the new ones.
  }

  // async dispatchObject(type: ObjectType, id: number, object: {}) {
  //   this.dispatchObjects({[type]: {[id]: object}});
  // }

  async dispatchObjects(objects: Objects, replaceAll: boolean = false) {
    this.store.dispatch(setObjects(objects, replaceAll));
  }

  /**
   * Loads objects from AsyncStorage and puts them into the store.
   *
   * If it can't find any of them, it first loads the ones that are missing from the remote server.
   *
   * Triggers a remote load for expired ones. If every object was found in AsyncStorage, this happens asynchronously
   * after the objects are dispatched.
   *
   * If currently offline, dispatches only the objects it can find on Storage.
   *
   * If called with recursive=true, this will also load all related objects.
   */
  async loadObjects(requests: Array<ObjectRequest>, recursive: boolean = false, forceRemoteLoad: boolean = false) {
    const convertItem = item => ({
      type: item[0].split(':').splice(-2, 1)[0], // Next to last part in cache key (e.g. "@Shelter:user:123")
      id: parseInt(item[0].split(':').slice(-1)[0], 10), // Last part
      object: JSON.parse(item[1]),
    });

    let loaded: Array<{ type: string, id: number, object: {} }> = [];
    let expired: Array<ObjectRequest> = [];

    if (!forceRemoteLoad) {
      loaded = (await Storage.multiGet(requests.map(o => Persist.cacheKey(o.type, o.id))))
        .map(convertItem)
        .filter(i => i.object); // Safety check: discard results that for some reason don't contain the actual objects

      if (loaded.length) {
        if (recursive) {
          let continueLoop = true; // When nothing was done on the loop, this is set to false
          let iterations = 10; // Limit the number of times we do this to prevent an infinite loop (which shouldn't happen anyway)

          do {
            const allRelatedRequests: Array<ObjectRequest> = [];
            const countBeforeProcessing = requests.length;

            loaded.map(item => {
              const relatedRequests = Model.getRelated(item.type, item.object)
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
              const temp = await Storage.multiGet(allRelatedRequests.map(o => Persist.cacheKey(o.type, o.id)));
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
        this.downloadFilesForObjects(objects);
      }

      expired = loaded
        .filter(item => (Persist.now() - item.object._last_read) > expirationLimitsByObjectType[item.type]) // Only take expired objects
        .filter(item => detailLevels[item.object._mode] >= detailLevels[OBJECT_MODE_PUBLIC]) // Only consider full (public or more) objects
        .map(item => ({type: item.type, id: item.id})); // Convert to ObjectRequest
    }

    const isOnline = this.store.getState().flags.online;
    let skipLoadingExpiredObjects = false;

    if (isOnline) {
      let loadImmediately: Array<ObjectRequest> = [];

      if (forceRemoteLoad)
        loadImmediately = requests;
      else
        loadImmediately = loaded.length >= requests.length
          ? [] // We don't need to load from remote immediately
          : requests
            .filter(request => {
              for (const item of loaded) {
                if (item.type === request.type && item.id === request.id)
                  return false; // This object request was found in "loaded" (i.e. it was loaded from storage), so we exclude it from loadImmediately.
              }
              return true;
            });

      if (loadImmediately.length) {
        loadImmediately.push(...expired); // Might as well load the expired objects in the same call
        skipLoadingExpiredObjects = true; // Flag to stop from doing this twice

        const result = await this.remote.loadObjects(loadImmediately);
        const newObjects = result.objects;

        this.updateLastRead(newObjects);
        await this.dispatchObjects(newObjects);
        this.saveObjects(newObjects);
      }
    }

    if (isOnline && !skipLoadingExpiredObjects && expired.length) {
      const newObjects: Objects = await this.remote.loadObjects(expired);
      this.updateLastRead(newObjects);
      await this.dispatchObjects(newObjects);
      this.saveObjects(newObjects);
    }
  }

  async saveSeen() {
    const seen = this.store.getState().seen;
    await Storage.setItem(Persist.cacheKey('seen'), JSON.stringify(seen));
  }

  /**
   * Deletes objects and files that have no references to them.
   */
  garbageCollect() {
    // TODO
  }
}

const persist = new Persist();

export default persist;
