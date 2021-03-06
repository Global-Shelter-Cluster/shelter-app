// @flow

import React from 'react';
import {connect} from 'react-redux';
import KoboFormListItem from '../components/KoboFormListItem';
import {getObject} from "../model";
import {withNavigation} from 'react-navigation';
import {convertFiles} from "../model/file";
import type {KoboFormObject} from "../model/kobo_form";
import * as WebBrowser from 'expo-web-browser';

const mapStateToProps = (state, props) => {
  const kobo_form: KoboFormObject = convertFiles(state, 'kobo_form', getObject(state, 'kobo_form', props.id));

  return {
    kobo_form,
    enter: () => WebBrowser.openBrowserAsync(kobo_form.kobo_form_url),
    // enter: () => props.navigation.push('Reporting', {title: kobo_form.title, url: kobo_form.kobo_form_url}),
  };
};

export default withNavigation(connect(mapStateToProps)(KoboFormListItem));
