// @flow

import type {ObjectRequest} from "../persist";
import type {PrivateUserObject, UserObject} from "./user";
import {getCurrentUser} from "./user";
import {createSelector} from 'reselect';
import createCachedSelector from 're-reselect';
import {OBJECT_MODE_STUB} from "./index";

// export type PrivateFactsheetObject = {
//   _last_read?: number,
//   _mode: "private",
//   id: number,
//   date: string, // TODO: proper date?
//   highlights: string, // HTML
//   image: string,
//   photo_credit: string,
//   map: string,
// }

export type PublicFactsheetObject = {
  _last_read?: number,
  _mode: "public",
  id: number,
  date: string, // TODO: proper date?
  highlights: string, // HTML
  image: string,
  photo_credit: string,
  map: string,
}

export type StubFactsheetObject = {
  _last_read?: number,
  _mode: "stub",
  id: number,
  date: string, // TODO: proper date?
  image: string,
}

export type FactsheetObject = PublicFactsheetObject | StubFactsheetObject;
// export type FactsheetObject = PrivateFactsheetObject | PublicFactsheetObject | StubFactsheetObject;

class Factsheet {
  static getRelated(factsheet: FactsheetObject): Array<ObjectRequest> {
    // TODO: should we have a reference to the group?
    return [];
  }
}

export const getFactsheet = createCachedSelector(
  (id, state) => id,
  (id, state) => state.objects.factsheet,
  (id, state) => state.objects.user,
  Factsheet.expand
)((id, state) => id);

export default Factsheet;
