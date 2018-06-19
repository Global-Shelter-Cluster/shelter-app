// @flow

import {createSelector} from 'reselect';
import type {ObjectFileDescription} from "../persist";
import persist from "../persist";
import Model from "./index";
import clone from "clone";

export const convertFiles = createSelector(
  state => state.files,
  (state, type, object) => Model.getFiles(type, object),
  (state, type, object) => object,
  (files, objectFileDescriptions: Array<ObjectFileDescription>, object) => {
    const ret = clone(object);
    objectFileDescriptions.map(f => {
      if (files[f.url] !== undefined)
        ret[f.property] = persist.directory + '/' + files[f.url].filename;
    });
    return ret;
  }
);
