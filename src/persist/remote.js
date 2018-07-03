// @flow

import type {Objects} from "../model";
import type {ObjectRequest} from "./index";
import persist from "./index";
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
  auth: {access_token: string, expires_in: string, expires_at: string, scope: string, refresh_token: string, token_type: string} = null;

  getAuthSettings() {
    let update_token, axiosConfigs, data;

    if (this.auth) {
      //console.log('this.auth: ', this.auth);
      // Add access token to authorization header.
      const now = Math.floor(Date.now() / 1000);
      if (this.auth.expires_at > now) {
        // console.log(config.axiosExtra);
        axiosConfigs = {
          headers: {'Authorization': "Bearer " + this.auth.access_token}
        };
      }

      // Access token is expired, try to use resfresh token.
      else {
        data.credentials = {
          'type': 'refresh_token',
          'refresh_token': this.auth.refresh_token,
          'client_id': 'shelter-client',
          'scope': 'response',
        }
        update_token = true;
      }
    }

    return {update_token, axiosConfigs, data};
  }

  async _post(path: string, data = null) {
    let update_token = false;
    //console.debug('Axios POST request', path, data);
    try {

      // TODO decide if we want to maintain basic auth on dev and exclude service routes.
      // config.axiosExtra;
      const authSettings = this.getAuthSettings();

      if (authSettings.data) {
        data.credentials = authSettings.data.credentials;
      }

      data = data ? JSON.stringify(data) : null;

      const response = await axios.post(path, data, authSettings.axiosConfigs);

      // Update token after using refresh_token.
      if (authSettings.update_token && response.status == '200' && response.data.authorization.code == '200') {
        persist.saveAuthTokens(response.data.authorization);
        this.auth = response.data.authorization;
      }

      // @TODO handle failure.

      //console.debug('Axios response', (response.request._response.length / 1024).toFixed(1) + 'KB');//, response.data);

      //console.debug('Axios response', response.data);
      return response.data;
    } catch (e) {
      //console.error('Axios error', e);
      throw e;
    }
  }

  async login(username: string, password: string): Objects {
    const data = await this._post('/get-objects', {
      'objects': [{type: 'global', id: 1}],
      'credentials': {
        'type': 'password',
        'username': username,
        'password': password,
        'client_id': 'shelter-client',
        'scope': 'response',
      }
    });

    if (data.authorization.code == '200' && data.authorization.access_token) {
      persist.saveAuthTokens(data.authorization);
      this.auth = data.authorization;
    }
    return data;
  }

  async loadObjects(requests: Array<ObjectRequest>): Objects {
    return this._post('/get-objects', {objects: requests});
  }

  async followGroup(id: number): Objects {
    return this._post('/follow/' + id, {'action': 'follow'});
  }

  async unfollowGroup(id: number): Objects {
    return this._post('/follow/' + id, {'action': 'unfollow'});
  }
}

export default Remote;
