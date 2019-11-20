// @flow

import React from 'react';
import {connect} from 'react-redux';
import {withNavigation} from 'react-navigation';
import SmartLink from "../components/SmartLink";
import {Linking} from "expo";

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
      if (props.url) {
        if (props.url.startsWith('mailto:')) {
          ret.linkType = 'email';
          ret.enter = () => Linking.openURL(props.url);
        } else if (props.url.startsWith('tel:')) {
          ret.linkType = 'tel';
          ret.enter = () => Linking.openURL(props.url);
        } else {
          ret.linkType = 'url'; // in case it didn't come in the prop

          const navOptions = {
            title: props.title !== undefined ? props.title : props.url,
            url: props.url,
          };
          ret.enter = () => props.navigation.push('WebsiteViewer', navOptions);
        }
      }
      break;
  }

  return ret;
};

export default withNavigation(connect(mapStateToProps)(SmartLink));
