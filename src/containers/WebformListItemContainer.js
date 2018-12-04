// @flow

import React from 'react';
import {connect} from 'react-redux';
import {getObject} from "../model";
import {withNavigation} from 'react-navigation';
import {convertFiles} from "../model/file";
import type {WebformObject} from "../model/webform";
import WebformListItem from "../components/WebformListItem";

const mapStateToProps = (state, props) => {
  const webform: WebformObject = convertFiles(state, 'webform', getObject(state, 'webform', props.id));

  return {
    webform,
    enter: () => props.navigation.push('Webform', {webformId: webform.id}),
  };
};

export default withNavigation(connect(mapStateToProps)(WebformListItem));
