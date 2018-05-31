// @flow

import type {UserData} from "../reducers/user";
import type {Objects} from "../reducers/objects";

/**
 * Class Remote.
 *
 * Handles communication with Drupal.
 * Is not allowed to talk to the redux store or the app itself.
 */
class Remote {
  static async temporaryDelayGenerator() {
    const ms: number = 500 + parseInt(Math.random() * 500, 10);

    function timeout(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    console.log('TEMPORARY delay generator: waiting for ' + ms + 'ms...');
    await timeout(ms);
    console.log('TEMPORARY delay generator: ...done.');
  }

  async login(user: string, pass: string): Objects {
    //TODO: fetch from Drupal
    await Remote.temporaryDelayGenerator();
    return {
      user: {
        "733": {
          id: 733,
          name: 'Camilo',
          mail: 'hola@cambraca.com',
          picture: "https://www.sheltercluster.org/sites/default/files/styles/thumbnail/public/pictures/picture-733-1509053312.jpg?itok=rgtEPr7h",
          groups: [9175, 10318],
        },
      },
      group: {
        "9175": {
          type: "response",
          id: 9175,
          title: "Ecuador Earthquake 2016",
        },
        "10318": {
          type: "response",
          id: 10318,
          title: "Haiti Hurricane Matthew 2016",
        },
      },
    };
  }
}

export default Remote;
