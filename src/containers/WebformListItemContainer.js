// @flow

import React from 'react';
import {connect} from 'react-redux';
import {getObject} from "../model";
import {withNavigation} from 'react-navigation';
import {convertFiles} from "../model/file";
import type {WebformObject} from "../model/webform";
import WebformListItem from "../components/WebformListItem";
import {ensurePermissions} from "../permission";
import {getPermissionsForWebform} from "../model/webform";
import clone from "clone";

const mapStateToProps = (state, props) => {
  let webform: WebformObject = convertFiles(state, 'webform', getObject(state, 'webform', props.id));

  const tempwebform: WebformObject = clone(webform);
  tempwebform.form[tempwebform.form.length-1].fields.push({
    type: 'geolocation',
    key: 'geo',
    name: 'Test geo location',
    description: 'hey there',
  });
  webform=tempwebform;

  const ret = {
    webform,
    enter: async () => {
      const permissions = getPermissionsForWebform(webform);

      if (permissions.length > 0) {
        try {
          await ensurePermissions(...permissions);
        } catch (e) {
          console.warn(e);
          return; // TODO: maybe say something to the user and give them a chance to grant the camera/gallery permissions again
        }
      }
      props.navigation.push('Webform', {webformId: webform.id});
    },
  };

  if (props.showGroup !== undefined && props.showGroup && webform.groups.length > 0)
    ret.group = convertFiles(state, 'group', getObject(state, 'group', webform.groups[0]));

  return ret;
};

export default withNavigation(connect(mapStateToProps)(WebformListItem));
