// @flow

import type {UserData} from "../reducers/user";

/**
 * Class Remote.
 *
 * Handles communication with Drupal.
 * Is not allowed to talk to the redux store or the app itself.
 */
class Remote {
  async loginAndGetUserData(user: string, pass: string): UserData {
    //TODO: fetch from Drupal
    return {
      id: 733,
      name: 'Camilo',
      updated: Math.floor(Date.now() / 1000),
      groups: [9175, 10318, 13438, 13439],
    };
  }
}

export default Remote;
