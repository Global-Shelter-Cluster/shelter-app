// @flow

import type {Objects} from "../model";
import type {ObjectRequest} from "./index";
import axiosLib from 'axios';
import config from "../config";
import {getCurrentUser} from "../model/user";

const axios = axiosLib.create({
  baseURL: config.baseUrl + '/api-v1',
  headers: {
    post: {
      'Content-Type': 'application/json',
    },
  },
});

// axios.interceptors.request.use(config => {
//   return config;
// });
//
// axios.interceptors.response.use(response => {
//   return response;
// }, error => {
//   return Promise.reject(error);
// });

/**
 * Class Remote.
 *
 * Handles communication with Drupal.
 * Is not allowed to talk to the redux store or the app itself.
 */
class Remote {
  async _post(path: string, data = null) {
    //console.debug('Axios POST request', path, data);
    try {
      // @TODO Augment data with appropriate credentials according to access_token expiry
      // or prensence of 'credentials' key in data.
      data = data ? JSON.stringify(data) : null;
      const response = await axios.post(path, data, config.axiosExtra);
      //console.debug('Axios response', (response.request._response.length / 1024).toFixed(1) + 'KB');//, response.data);

      //console.debug('Axios response', response.data);
      return response.data;
    } catch (e) {
      //console.error('Axios error', e);
      throw e;
    }
  }

  async _delete(path: string) {
    //console.debug('Axios DELETE request', path);
    try {
      const response = await axios.delete(path, config.axiosExtra);
      //console.debug('Axios response', (response.request._response.length / 1024).toFixed(1) + 'KB');//, response.data);
      return response.data;
    } catch (e) {
      //console.error('Axios error', e);
      throw e;
    }
  }

  async login(username: string, password: string): Objects {
    return this._post('/get-objects', {
      'objects': [{type: 'global', id: 1}],
      'credentials': {
        'type': 'password',
        'username': username,
        'password': password,
        'client_id': 'shelter-client',
        'scope': 'response',
      }
    });
  }

  async loadObjects(requests: Array<ObjectRequest>): Objects {
    return this._post('/get-objects', {'objects': requests});
  }

  async followGroup(id: number): Objects {
    return this._post('/follow/' + id);
  }

  async unfollowGroup(id: number): Objects {
    return this._delete('/follow/' + id);
  }
}

export default Remote;
