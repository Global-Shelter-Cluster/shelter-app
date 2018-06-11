// @flow

import {SQLite} from 'expo';
import websql from 'websql-promisified';

class Storage {
  db: { transaction: ({}) => {} };
  initialized: boolean = false;
  initializing: boolean = false;

  async init() {
    if (this.initialized || this.initializing)
      return;

    this.initializing = true;

    const dbRaw = SQLite.openDatabase('shelter');
    this.db = websql(dbRaw);

    await this.db.transaction(tx => {
      tx.executeSql(
          `CREATE TABLE IF NOT EXISTS items (
            k text primary key not null,
            v text             not null
          );`
      );
    });

    this.initialized = true;
    this.initializing = false;
  }

  async getItem(key: string) {
    await this.init();

    const results = await this.db.transaction(tx => {
      tx.executeSql(
          `SELECT v
           FROM items
           WHERE k = ?;`,
        [key]
      );
    });

    if (results[0].rows.length === 0)
      return null;

    return results[0].rows.item(0).v;
  }

  async setItem(key: string, value: string) {
    await this.init();

    const temp = await this.db.transaction(tx => {
      tx.executeSql(
          `DELETE FROM items
          WHERE k = ?;`,
        [key]
      );
      tx.executeSql(
          `INSERT INTO items (k, v)
          VALUES (?, ?);`,
        [key, value]
      );
    });
  }

  async multiGet(keys: Array<string>) {
    if (keys.length === 0)
      return [];

    await this.init();

    const results = await this.db.transaction(tx => {
      const placeholders = ",?".repeat(keys.length).substr(1);
      tx.executeSql(
        `SELECT *
           FROM items
           WHERE k IN (${placeholders});`,
        keys
      );
    });

    const ret = [];

    for (let i = 0; i < results[0].rows.length; i++)
      ret.push([results[0].rows.item(i).k, results[0].rows.item(i).v])

    return ret;
  }

  async multiSet(data: Array<[string, string]>) {
    data.map(tuple => this.setItem(tuple[0], tuple[1]));
  }

  async clear() {
    await this.init();

    await this.db.transaction(tx => {
      tx.executeSql(`DELETE FROM items;`);
    });
  }
}

export default new Storage();
