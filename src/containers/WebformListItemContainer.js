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
    enter: () => console.log('enter', webform),
    // enter: () => props.navigation.push('Reporting', {title: kobo_form.title, url: kobo_form.kobo_form_url}),
  };
};

export default withNavigation(connect(mapStateToProps)(WebformListItem));
