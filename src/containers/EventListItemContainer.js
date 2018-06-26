// @flow

import React from 'react';
import {connect} from 'react-redux';
import EventListItem from '../components/EventListItem';
import {detailLevels, getObject, OBJECT_MODE_PUBLIC} from "../model";
import {withNavigation} from 'react-navigation';
import {convertFiles} from "../model/file";
import type {EventObject} from "../model/event";

const mapStateToProps = (state, props) => {
  const event: EventObject = convertFiles(state, 'event', getObject(state, 'event', props.id));
  const hasLink = state.flags.online || detailLevels[event._mode] >= detailLevels[OBJECT_MODE_PUBLIC];

  const ret = {event};
  if (hasLink)
    ret.enter = () => props.navigation.push('Event', {eventId: event.id});

  return ret;
};

export default withNavigation(connect(mapStateToProps)(EventListItem));
