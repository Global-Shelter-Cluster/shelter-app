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

  return {
    event: event,
    link: state.flags.online || detailLevels[event._mode] >= detailLevels[OBJECT_MODE_PUBLIC],
    enter: (id: number) => props.navigation.push('Event', {eventId: id}),
  };
};

export default withNavigation(connect(mapStateToProps)(EventListItem));
