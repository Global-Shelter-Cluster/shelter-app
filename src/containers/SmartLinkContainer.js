// @flow

import React from 'react';
import {connect} from 'react-redux';
import {withNavigation} from 'react-navigation';
import SmartLink from "../components/SmartLink";

const mapStateToProps = (state, props) => {
  const ret = {};

  switch (props.linkType) {
    case 'document':
      ret.enter = () => props.navigation.push('Document', {documentId: props.id});
      break;
    case 'event':
      ret.enter = () => props.navigation.push('Event', {eventId: props.id});
      break;
    case 'factsheet':
      ret.enter = () => props.navigation.push('Factsheet', {factsheetId: props.id});
      break;
    case 'kobo_form':
      ret.enter = () => props.navigation.push('KoboForm', {koboFormId: props.id});
      break;
    case 'webform':
      ret.enter = () => props.navigation.push('Webform', {webformId: props.id});
      break;
    case 'group':
      ret.enter = () => props.navigation.push('Group', {groupId: props.id});
      break;
    case 'url':
      //Fall-through
    default:
      ret.linkType = 'url'; // in case it didn't come in the prop
      ret.enter = () => props.navigation.push('WebsiteViewer', {title: props.title, url: props.url});
      break;
  }

  return ret;
};

export default withNavigation(connect(mapStateToProps)(SmartLink));
