// @flow

import {createSelector} from 'reselect';
import type {ObjectFileDescription} from "../persist";
import persist from "../persist";
import Model from "./index";
import clone from "clone";
import jsonpath from "jsonpath";

export const convertFiles = createSelector(
  state => state.files,
  (state, type, object) => Model.getFiles(type, object),
  (state, type, object) => object,
  (files, objectFileDescriptions: Array<ObjectFileDescription>, object) => {
    const ret = clone(object);
    objectFileDescriptions.map(f => {
      if (files[f.url] === undefined)
        return;

      if (f.property !== undefined)
        ret[f.property] = persist.directory + '/' + files[f.url].filename;

      if (f.json_path !== undefined) {
        console.log('CAM1', JSON.stringify(ret));
        const temp = jsonpath.apply(ret, f.json_path, () => persist.directory + '/' + files[f.url].filename);
        console.log('CAM2', JSON.stringify(ret));
        console.log('CAM3', JSON.stringify(temp));
      }
    });
    return ret;
  }
);
