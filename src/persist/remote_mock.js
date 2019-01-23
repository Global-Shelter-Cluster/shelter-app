// @flow

import type {Objects} from "../model";
import {OBJECT_MODE_PRIVATE, OBJECT_MODE_STUB} from "../model";
import type {ObjectRequest} from "./index";
import {OBJECT_MODE_PUBLIC} from "../model/index";

/**
 * Class Remote.
 *
 * Handles communication with Drupal.
 * Is not allowed to talk to the redux store or the app itself.
 */
class Remote {
  static async temporaryDelayGenerator() {
    const ms: number = 1000 + parseInt(Math.random() * 1000, 10);

    const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    console.log('TEMPORARY delay generator: waiting for ' + ms + 'ms...');
    await timeout(ms);
    console.log('TEMPORARY delay generator: ...done.');
  }

  async login(user: string, pass: string): Objects {
    //TODO: fetch from Drupal
    //console.log('REMOTE login()', user, pass);
    return this.loadObjects([]);
  }

  async loadObjects(requests: Array<ObjectRequest>): Objects {
    //TODO: fetch from Drupal
    await Remote.temporaryDelayGenerator();
    //console.log('REMOTE loadObjects()', requests);
    return {
      user: {
        "733": {
          _mode: OBJECT_MODE_PRIVATE,
          _persist: true,
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
          _persist: true,
          type: "response",
          id: 9175,
          title: "Ecuador Earthquake 2016",
          associated_regions: [9104, 62],
          latest_factsheet: 13454,
        },
        "10318": {
          _mode: OBJECT_MODE_PRIVATE,
          _persist: true,
          type: "response",
          id: 10318,
          title: "Haiti Hurricane Matthew 2016",
          associated_regions: [68, 7370, 62],
          parent_response: 10339,
          latest_factsheet: 13455,
        },
        "9104": {
          _mode: OBJECT_MODE_STUB,
          _persist: true,
          type: "geographic_region",
          id: 9104,
          title: "Ecuador",
        },
        "62": {
          _mode: OBJECT_MODE_STUB,
          _persist: true,
          type: "geographic_region",
          id: 62,
          title: "Americas",
        },
        "68": {
          _mode: OBJECT_MODE_STUB,
          _persist: true,
          type: "geographic_region",
          id: 68,
          title: "Haiti",
        },
        "7370": {
          _mode: OBJECT_MODE_STUB,
          _persist: true,
          type: "geographic_region",
          id: 7370,
          title: "Caribbean",
        },
        "10339": {
          _mode: OBJECT_MODE_STUB,
          _persist: true,
          type: "response",
          id: 10339,
          title: "Regional Hurricane Matthew 2016",
        },
      },
      factsheet: {
        "13454": {
          _mode: OBJECT_MODE_PUBLIC,
          _persist: true,
          id: 13454,
          date: "2018-04",
          highlights: "<p>El <strong>16 de abril de 2016</strong>, un terremoto de magnitud 7,8 con una profundidad de 20km golpeó la costa de Ecuador. El epicentro sucedió a 27 km al sur sureste de la ciudad costera de Muisne, una zona escasamente poblada con puertos de pesca muy populares y con atracción turística muy importante. El mayor impacto con daños de alta consideración fue en la localidad de Pedernales y Portoviejo.  Posterior al evento sísmico el Gobierno declaró \"zona de desastre\" y “estado de emergencia”  en seis provincias: Esmeraldas, Guayas, Los Ríos, Manabí, Santo Domingo y Santa Elena.</p>",
          image: "https://www.dropbox.com/s/6lv22bmawkr3w34/20160804_145050.jpg?dl=1",
          photo_credit: "Anna Pont",
          map: "",
        },
        "13455": {
          _mode: OBJECT_MODE_PUBLIC,
          _persist: true,
          id: 13455,
          date: "2018-05",
          highlights: "<p><font style=\"vertical-align: inherit;\"><font style=\"vertical-align: inherit;\">Coordination of interventions in the Shelter / BNA sector was provided by the DPC with the support of the IOM (co-lead) at national and departmental level (Grande Anse and Sud). </font><font style=\"vertical-align: inherit;\">A total of 86 partners (including 30 Haitians and 56 internationals) contributed to the response in 8 departments and 72 municipalities.&nbsp;</font></font><span style=\"font-size: 1rem;\"><font style=\"vertical-align: inherit;\"><font style=\"vertical-align: inherit;\">As of March 20, 2017, 189,412 households received plastic sheeting or emergency shelter kits, 105,896 households received blankets, 26,277 households received tool kits and 5,306 households received sheet metal kits.</font></font></span></p>",
          image: "https://www.sheltercluster.org/sites/default/files/sites/default/files/content/haiti_-_coteaux_-_nov_2016_-_gael_leloup_0.jpg",
          photo_credit: "",
          map: "",
        },
      },
    };
  }
}

export default Remote;
