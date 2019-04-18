// @flow

import type {Objects} from "../model";
import type {ObjectRequest} from "./index";
import persist from "./index";
import axiosLib from "axios";
import config from "../config";
import type {newAccountValues} from "../screens/auth/Signup";

const axios = axiosLib.create({
  baseURL: config.baseUrl + "/api-v1",
  headers: {
    post: {
      'Content-Type': 'application/json'
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

export type authType = {
  access_token: string,
  code: "200",
  expires_at: number,
  expires_in: string, // seconds
  refresh_token: string,
  scope: string, // e.g. "response"
  token_type: string, // e.g. "Bearer"
}

/**
 * Class Remote.
 *
 * Handles communication with Drupal.
 * Is not allowed to talk to the redux store or the app itself.
 */
class Remote {
  auth: null | authType = null;

  async _post(path: string, data: { credentials?: {}, pushNotificationToken?: string | null } = {}): Promise<{ objects?: Objects, authorization?: authType }> {
    // console.debug('Axios POST request', path, data, this.auth);

    try {
      // TODO decide if we want to maintain basic auth on dev and exclude service routes.
      let axiosConfigs = {}; // config.axiosExtra;
      let shouldSaveAuthTokens = data.credentials !== undefined;

      if (this.auth !== null) {
        // Add access token to authorization header.
        const now = Math.floor(Date.now() / 1000);
        if (this.auth.expires_at > now) {
          axiosConfigs = {
            headers: {'Authorization': "Bearer " + this.auth.access_token}
          };
        } else if (data.credentials === undefined) {
          // Access token is expired, try to use refresh token.
          data.credentials = {
            'type': 'refresh_token',
            'refresh_token': this.auth.refresh_token,
            'client_id': 'shelter-client',
            'scope': 'response',
          };
          shouldSaveAuthTokens = true;
        }
      }

      const response = await axios.post(path, JSON.stringify(data), axiosConfigs);
      // console.debug('Axios response', response.data);

      // Update token after using refresh_token.
      if (
        shouldSaveAuthTokens
        && response.status === 200
        && response.data
        && response.data.authorization
        && response.data.authorization.code === '200'
        && response.data.authorization.access_token
      ) {
        persist.saveAuthTokens(response.data.authorization);
        this.auth = response.data.authorization;
      }

      if (
        response.data
        && response.data.authorization
        && response.data.authorization.code !== '200'
      ) {
        const message = response.data.authorization.error_description
          ? response.data.authorization.error_description
          : 'Unknown error, please try again';
        throw new Error(message);
      }

      //console.debug('Axios response', (response.request._response.length / 1024).toFixed(1) + 'KB');//, response.data);
      // console.log('languages:', response.data.objects.languages);
      return response.data;
    } catch (e) {
      //console.error('Axios error', e);
      if (e.response && e.response.data && typeof e.response.data[0] === 'string')
      // We have an error message, show it instead of the default Axios message
        throw new Error(e.response.data[0]);
      throw e;
    }
  }

  async login(username: string, password: string, pushNotificationToken: string | null): Promise<Objects> {
    this.auth = null;

    const data = await this._post('/get-objects', {
      'objects': [{type: 'global', id: 1}],
      'credentials': {
        'type': 'password',
        'username': username,
        'password': password,
        'client_id': 'shelter-client',
        'scope': 'response',
      },
      pushNotificationToken,
    });

    return data.objects !== undefined ? data.objects : {};
  }

  async signup(accountValues: newAccountValues, pushNotificationToken: string | null): Promise<Objects> {
    const data = await this._post('/signup', {
      'objects': [{type: 'global', id: 1}],
      'credentials': {
        'account_values': accountValues,
        'client_id': 'shelter-client',
        'scope': 'signup',
      },
      pushNotificationToken,
    });
    return data.objects !== undefined ? data.objects : {};
  }

  async requestNewPassword(value: string): Promise<Objects> {
    await this._post('/forgot', {value});
  }

  async updateUser(updates: Object): Promise<Objects> {
    const res = await this._post('/update-user', {
      updates,
      'objects': [{type: 'global', id: 1}],
    });
  }

  logout(pushNotificationToken: string | null) {
    return this._post('/logout', {
      pushNotificationToken,
    });
  }

  async loadObjects(requests: Array<ObjectRequest>): Promise<Objects> {
    const data = await this._post('/get-objects', {objects: requests});
    return data.objects !== undefined ? data.objects : {};
  }

  async followGroup(id: number): Promise<Objects> {
    const data = await this._post('/follow/' + id, {action: 'follow'});
    return data.objects !== undefined ? data.objects : {};
  }

  async unfollowGroup(id: number): Promise<Objects> {
    const data = await this._post('/follow/' + id, {action: 'unfollow'});
    return data.objects !== undefined ? data.objects : {};
  }

  /**
   * Files must be encoded as base64, e.g. "data:image/jpeg;base64,XYZ..."
   */
  async submitAssessmentForm(type: string, id: number, values: {}): Promise<> {
    const data = await this._post('/submit-assessment/' + type + '/' + id, {assessment: values});
    if (data.assessment_errors !== undefined && data.assessment_errors)
      throw new Error(data.assessment_errors);

    return null;
  }

  async getFilesSize(urls: Array<string>): Promise<number> {
    try {
      const data = await this._post('/get-files-size', urls);
      return parseInt(data.total, 10);
    } catch (e) {
      return 0;
    }
  }

  async getRemoteAppConfig() {
    const res = await axiosLib.get(`${config.baseUrl}/app_config.json?b=${Math.random()}`);
    return res;
  }

  async getTranslations(lang: String) {
    const res = await axiosLib.get(`${config.baseUrl}/api-v1/app-translations/${lang}.json`);
    return res;
  }

  async getEnabledLanguages() {
    const res = await axios.get(`${config.baseUrl}/api-v1/app-languages`);
    return res;
  }

}

export default Remote;
