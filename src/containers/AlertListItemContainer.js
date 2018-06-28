// @flow

import React from 'react';
import {connect} from 'react-redux';
import AlertListItem from '../components/AlertListItem';
import {getObject} from "../model";
import {withNavigation} from 'react-navigation';
import {convertFiles} from "../model/file";
import type {AlertObject} from "../model/alert";
import {markSeen} from "../actions";
import {isObjectSeen} from "../model/alert";

const mapStateToProps = (state, props) => {
  const alert: AlertObject = convertFiles(state, 'alert', getObject(state, 'alert', props.id));

  const ret = {
    alert,
    isSeen: isObjectSeen(state, 'alert', alert.id),
    isTeaser: alert.groups !== undefined && props.isTeaser,
    group: alert.groups !== undefined ? convertFiles(state, 'group', getObject(state, 'group', alert.groups[0])) : null,
  };

  if (alert.document !== undefined) {
    ret.linkType = 'document';
    ret.enter = () => props.navigation.push('Document', {documentId: alert.document});
  } else if (alert.event !== undefined) {
    ret.linkType = 'event';
    ret.enter = () => props.navigation.push('Event', {eventId: alert.event});
  } else if (alert.factsheet !== undefined) {
    ret.linkType = 'factsheet';
    ret.enter = () => props.navigation.push('Factsheet', {factsheetId: alert.factsheet});
  } else if (alert.kobo_form !== undefined) {
    ret.linkType = 'kobo_form';
    ret.enter = () => props.navigation.push('KoboForm', {koboFormId: alert.kobo_form});
  } else if (alert.group !== undefined) {
    ret.linkType = 'group';
    ret.enter = () => props.navigation.push('Group', {groupId: alert.group});
  } else if (alert.url !== undefined) {
    ret.linkType = 'url';
    ret.enter = () => props.navigation.push('WebsiteViewer', {title: alert.title, url: alert.url});
  }

  if (alert.groups !== undefined && props.isTeaser) {
    ret.enter = () => props.navigation.push('AlertList', {groupId: alert.groups[0]});
  }

  return ret;
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    markSeen: () => dispatch(markSeen('alert', props.id)),
  };
};

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(AlertListItem));
