// @flow

import {
  addAssessmentFormSubmission,
  clearAllDownloads,
  downloadFiles,
  logout,
  mergeLocalVars,
  replaceAllSeenObjects,
  setCurrentUser,
  setFile,
  setFiles,
  setObjects,
  updateLanguages,
  setCurrentLanguage,
  getTranslations,
  updateTranslations,
  updateRemoteAppConfig,
} from "../actions";
import type {Store} from "redux";
import type {authType} from "./remote";
import Remote from "./remote";
import type {ObjectIds, Objects, ObjectType} from "../model";
import Model, {
  detailLevels,
  expirationLimitsByObjectType,
  initialObjectIdsState,
  OBJECT_MODE_PRIVATE,
  OBJECT_MODE_PUBLIC
} from "../model";
import * as FileSystem from 'expo-file-system';
import md5 from "md5";
import Storage from "./storage_async";
// import Storage from "./storage_sqlite";
import config from "../config";
import clone from 'clone';
import {GLOBAL_OBJECT_ID} from "../model/global";
import {getExtension} from "../util";
import type {PrivateUserObject} from "../model/user";
import {getCurrentUser} from "../model/user";
import {getPushToken} from "../push.js";
import type {newAccountValues} from "../screens/auth/Signup";
import type {localVarsType} from "../reducers/localVars";

const DIR_PERSISTED = 'persisted';

export type ObjectRequest = {
  type: ObjectType,
  id: number,
}

export type ObjectFileDescription = {
  type: ObjectType,
  id: number,
  path?: string,
  property: string,
  url: string,
}

export type Files = {
  [url: string]: {
    filename: string,
    uses: Array<ObjectRequest>,
  }
}

export type AssessmentFormType = "webform";

export type AssessmentFormSubmission = {
  type: AssessmentFormType,
  id: number,
  values: {},
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
    try {
      this.remote = new Remote;
      await this.getEnabledLanguages(this.store.getState().flags.online);
      this.setCurrentLanguage();
      await this.initDirectory(DIR_PERSISTED);
      await this.getRemoteAppConfig();

      const authString: string | null = await Storage.getItem(Persist.cacheKey('auth'));
      if (authString) {
        this.remote.auth = JSON.parse(authString);
      }

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

      const localVarsString: string | null = await Storage.getItem(Persist.cacheKey('localVars'));
      if (localVarsString !== null) {
        const localVars: localVarsType = JSON.parse(localVarsString);
        await this.store.dispatch(mergeLocalVars(localVars));
      }

      await this.store.dispatch(setCurrentUser(id));
      await this.loadObjects([
        {type: "global", id: GLOBAL_OBJECT_ID},
        {type: "user", id: id},
      ], true);

      const submissionsString: string | null = await Storage.getItem(Persist.cacheKey('pendingAssessmentFormSubmissions'));
      if (submissionsString !== null) {
        const submissions = JSON.parse(submissionsString);
        for (const submission of submissions)
          await this.store.dispatch(addAssessmentFormSubmission(submission));
      }

    } catch (e) {
      console.log('Error during initialization', e);
      await this.store.dispatch(logout());
    }
  }

  async initDirectory(directory: string) {
    this.directory = await this.initArbitraryDirectory(directory);
  }

  /**
   * @param directory string, e.g. "webform"
   * @returns {Promise<string>} The complete path
   */
  async initArbitraryDirectory(directory: string) {
    directory = FileSystem.documentDirectory + directory;
    const dirInfo: { exists: boolean, isDirectory: boolean } = await FileSystem.getInfoAsync(directory);

    if (!dirInfo.exists)
      await FileSystem.makeDirectoryAsync(directory);
    else if (!dirInfo.isDirectory) {
      // Our directory exists as a file. Delete it and create a directory instead.
      await FileSystem.deleteAsync(directory);
      await FileSystem.makeDirectoryAsync(directory);
    }

    return directory;
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
        // console.log(objects[type]);
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
    this.deleteAuthTokens();
    this.store.dispatch(replaceAllSeenObjects(initialObjectIdsState));
    if (this.remote) {
      this.remote.auth = null;
    }
    this.store.dispatch(updateRemoteAppConfig());
    this.store.dispatch(updateTranslations());
    this.store.dispatch(updateLanguages());
    this.store.dispatch(setCurrentLanguage());
    console.debug('Cleared storage');
    if (force || config.deleteFilesOnLogout) {
      FileSystem.deleteAsync(this.directory, {idempotent: true}).then(
        () => this.initDirectory(DIR_PERSISTED)
      );
      console.debug('Deleted all files');
    }
  }

  async saveAuthTokens(token: authType) {
    if (token.access_token) {
      await Storage.setItem(Persist.cacheKey('auth'), JSON.stringify(token));
    }
  }

  async deleteAuthTokens() {
    await Storage.removeItem(Persist.cacheKey('auth'));
  }

  async logout() {
    // Always get user data from remote on login
    const pushToken = await getPushToken();
    this.remote.logout(pushToken);
  }

  async login(user: string, pass: string) {
    // Always get user data from remote on login
    const pushToken = await getPushToken();
    console.debug('Logging in, push token: ' + pushToken);
    const objects = await this.remote.login(user, pass, pushToken);

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

  async signup(accountValues: newAccountValues) {
    // Always get user data from remote on login
    const pushToken = await getPushToken();
    const objects = await this.remote.signup(accountValues, pushToken);

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

  async requestNewPassword(value: string) {
    await this.remote.requestNewPassword(value);
  }

  async followGroup(id: number) {
    // Remote returns the group and related objects
    const objects: Objects = await this.remote.followGroup(id);

    const user: PrivateUserObject = clone(getCurrentUser(this.store.getState()));
    if (user.groups === undefined)
      user.groups = [];
    user.groups.push(id);
    if (objects.user === undefined)
      objects.user = {};
    objects.user['' + user.id] = user;

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
    // Check if we're trying to store the current user as anything other than "mode:private", and remove it if it is.
    const currentUser = this.store.getState().currentUser;
    if (currentUser && objects.user[currentUser] !== undefined && objects.user[currentUser]._mode !== "private")
      delete objects.user[currentUser];

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
        .filter(i => typeof i.object === 'object' && i.object !== null); // Safety check: discard results that for some reason don't contain the actual objects

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
              loaded.push(...temp
                .map(convertItem)
                .filter(i => typeof i.object === 'object' && i.object !== null) // Safety check: discard results that for some reason don't contain the actual objects
              );
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

        const newObjects = await this.remote.loadObjects(loadImmediately);
        //console.log('persist::loadObjects', newObjects);
        this.updateLastRead(newObjects);
        await this.dispatchObjects(newObjects);
        this.saveObjects(newObjects);
      }
    }

    if (isOnline && !skipLoadingExpiredObjects && expired.length) {
      const newObjects = await this.remote.loadObjects(expired);
      this.updateLastRead(newObjects);
      await this.dispatchObjects(newObjects);
      this.saveObjects(newObjects);
    }
  }

  async saveSeen() {
    const seen = this.store.getState().seen;
    await Storage.setItem(Persist.cacheKey('seen'), JSON.stringify(seen));
  }

  async saveLocalVars() {
    const localVars = this.store.getState().localVars;
    await Storage.setItem(Persist.cacheKey('localVars'), JSON.stringify(localVars));
  }

  async submitAssessmentForm(type: AssessmentFormType, id: number, values: {}) {
    // Assume we're online, just try to send it (offline logic is handled in the submitAssessmentForm action).

    // TODO: this call should probably return objects, which should be saved here.
    // This, in order to see the submissions on the app, and for the ability to
    // edit your submission (once we support those things).

    console.debug("submitAssessmentForm", type, id, values);
    const processedValues = await this.processSubmissionFiles(values);
    console.debug("submitAssessmentForm: processed values", processedValues);
    await this.remote.submitAssessmentForm(type, id, processedValues);

    this.deleteAnySubmittedFiles(values);
  }

  async processSubmissionFiles(values: {}) {
    const newValues: {} = clone(values);

    for (const key in newValues) {
      if (typeof newValues[key] !== "string" || !newValues[key].startsWith("file://"))
        continue;

      const info = await FileSystem.getInfoAsync(newValues[key]);
      if (!info.exists || info.isDirectory)
        continue;

      const base64Data = await FileSystem.readAsStringAsync(newValues[key], {encoding: 'base64'});// TODO: this should use `FileSystem.EncodingTypes.Base64` instead of the hardcoded string

      let mimetype = 'image/jpeg'; // TODO: for now, since we only support images, we assume jpeg

      newValues[key] = 'data:' + mimetype + ';base64,' + base64Data;
      // newValues[key] = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='; // small red dot png
    }

    return newValues;
  }

  async deleteAnySubmittedFiles(values: {}) {
    for (const key in values) {
      if (typeof values[key] !== "string" || !values[key].startsWith("file://"))
        continue;

      try {
        await FileSystem.deleteAsync(values[key], {idempotent: true});
      } catch (e) {
      }
    }
  }

  async savePendingAssessmentFormSubmissions() {
    const submissions = this.store.getState().bgProgress.assessmentFormSubmissions;
    await Storage.setItem(Persist.cacheKey('pendingAssessmentFormSubmissions'), JSON.stringify(submissions));
  }

  async getFilesSize(urls: Array<string>) {
    return this.remote.getFilesSize(urls);
  }

  // Add enabled languages to the store.
  async getEnabledLanguages(forceRefresh = false) {
    if (!forceRefresh) {
      const enabledLanguages = await Storage.getItem('enabledLanguages');
      if (enabledLanguages !== null) {
        this.store.dispatch(updateLanguages(JSON.parse(enabledLanguages)));
        return;
      }
    }

    const {data} = await this.remote.getEnabledLanguages();
    if (data) {
      this.store.dispatch(updateLanguages(data));
      Storage.setItem('enabledLanguages', JSON.stringify(data));
    }
  }

  async setCurrentLanguage() {
    const currentLanguage = await Storage.getItem('currentLanguage') || 'en';
    this.store.dispatch(setCurrentLanguage(currentLanguage));
    this.store.dispatch(getTranslations(currentLanguage));
  }

  async getTranslations(lang) {
    const {data} = await this.remote.getTranslations(lang);
    return data;
  }

  async getRemoteAppConfig() {
    const {data: remoteConfig = {}} = await this.remote.getRemoteAppConfig()
      .catch((e) => {
        console.log('No remote config');
        this.store.dispatch(updateRemoteAppConfig())
        return false;
      });

    const currentAppConfig = await this.store.getState().appRemoteConfig;
    if (currentAppConfig.updatedAt === remoteConfig.updatedAt) {
      return;
    }
    this.store.dispatch(updateRemoteAppConfig(remoteConfig))
  }

  async remoteConfigHasChanged(key, value) {
    const {data: remoteConfig = {}} = await this.remote.getRemoteAppConfig()
      .catch((e) => {
        console.log('No remote config');
        return false;
      });
    const currentAppConfig = await this.store.getState().appRemoteConfig;

    if (currentAppConfig.updatedAt === remoteConfig.updatedAt) {
      return false;
    }

    await this.store.dispatch(updateRemoteAppConfig(remoteConfig))
    if (remoteConfig[key] === value) {
      return false;
    }

    return true;
  }

  // Updates to Drupal user account.
  async updateUser(values: Object) {
    const processedValues = await this.processSubmissionFiles(values);
    const {objects, update_messages} = await this.remote.updateUser(processedValues);
    this.deleteAnySubmittedFiles(values);

    // Save everything we received (user object, groups, etc.)
    this.updateLastRead(objects);
    this.saveObjects(objects);
    this.dispatchObjects(objects);
    return update_messages;
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
