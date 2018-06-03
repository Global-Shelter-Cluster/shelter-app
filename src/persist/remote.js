// @flow

import type {Objects} from "../model";
import {OBJECT_MODE_PRIVATE, OBJECT_MODE_STUB} from "../model";
import type {ObjectRequest} from "./index";

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
    console.log('REMOTE login()', user, pass);
    return this.loadObjects([]);
  }

  async loadObjects(requests: Array<ObjectRequest>): Objects {
    //TODO: fetch from Drupal
    await Remote.temporaryDelayGenerator();
    console.log('REMOTE loadObjects()', requests);
    return {
      user: {
        "733": {
          _mode: OBJECT_MODE_PRIVATE,
          id: 733,
          name: 'Camilo',
          mail: 'hola@cambraca.com',
          picture: "https://www.sheltercluster.org/sites/default/files/styles/thumbnail/public/pictures/picture-733-1509053312.jpg?itok=rgtEPr7h",
          org: "International Federation of Red Crosses",
          role: "Software developer",
          groups: [9175, 10318],
        },
      },
      group: {
        "9175": {
          _mode: OBJECT_MODE_PRIVATE,
          type: "response",
          id: 9175,
          title: "Ecuador Earthquake 2016",
          associated_regions: [9104, 62],
          parent_response: null,
        },
        "10318": {
          _mode: OBJECT_MODE_PRIVATE,
          type: "response",
          id: 10318,
          title: "Haiti Hurricane Matthew 2016",
          associated_regions: [68, 7370, 62],
          parent_response: 10339,
        },
        "9104": {
          _mode: OBJECT_MODE_STUB,
          type: "geographic_region",
          id: 9104,
          title: "Ecuador",
        },
        "62": {
          _mode: OBJECT_MODE_STUB,
          type: "geographic_region",
          id: 62,
          title: "Americas",
        },
        "68": {
          _mode: OBJECT_MODE_STUB,
          type: "geographic_region",
          id: 68,
          title: "Haiti",
        },
        "7370": {
          _mode: OBJECT_MODE_STUB,
          type: "geographic_region",
          id: 7370,
          title: "Caribbean",
        },
        "10339": {
          _mode: OBJECT_MODE_STUB,
          type: "response",
          id: 10339,
          title: "Regional Hurricane Matthew 2016",
        },
      },
    };
  }
}

export default Remote;
