// @flow

import type {Objects} from "../model";
import type {ObjectRequest} from "./index";
import axiosLib from 'axios';
import config from "../config";

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
  async request(path: string, data = null) {
    console.debug('Axios request', path, data);
    try {
      data = data ? JSON.stringify(data) : null;
      const response = await axios.post(path, data, config.axiosExtra);
      console.debug('Axios response', (response.request._response.length / 1024).toFixed(1) + 'KB');//, response.data);
      return response.data;
    } catch (e) {
      console.error('Axios error', e);
      throw e;
    }
  }

  async login(user: string, pass: string): Objects {
    return this.request('/get-objects', [{type: 'global', id: 1}, {type: 'user', id: 733}]);
  }

  async loadObjects(requests: Array<ObjectRequest>): Objects {
    return this.request('/get-objects', requests);
  }

  async followGroup(id: number): Objects {
    return this.request('/follow/' + id);
  }
}

export default Remote;
