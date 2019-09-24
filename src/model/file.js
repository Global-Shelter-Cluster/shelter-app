// @flow

import {createSelector} from 'reselect';
import type {ObjectFileDescription} from "../persist";
import persist from "../persist";
import Model from "./index";
import clone from "clone";
import JSPath from "jspath";

export const convertFiles = createSelector(
  state => state.files,
  (state, type, object) => Model.getFiles(type, object),
  (state, type, object) => object,
  (files, objectFileDescriptions: Array<ObjectFileDescription>, object) => {
    const ret = clone(object);
    objectFileDescriptions.map(f => {
      if (files[f.url] === undefined)
        return;

      if (f.path !== undefined) {
        const result = JSPath.apply(f.path, ret);
        if (result)
          result[f.property] = persist.directory + '/' + files[f.url].filename;
      } else
        ret[f.property] = persist.directory + '/' + files[f.url].filename;
    });
    return ret;
  }
);

export const isLocalFile = url => typeof url == "string" && url.startsWith("file://");
