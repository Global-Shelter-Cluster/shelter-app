// @flow

import React from 'react';
import {connect} from 'react-redux';
import {clearNotification} from '../actions';
import Notification from '../components/Notification';
import {getNotificationEnter} from "../model/notification";

const mapStateToProps = (state, props) => ({
  show: !state.flags.initializing && !state.flags.loggingIn && state.currentUser !== null,
  notification: state.notification,
  enter: () => getNotificationEnter(state, props.navigation),
});

const mapDispatchToProps = dispatch => {
  return {
    dismiss: () => dispatch(clearNotification()),
  };
};

const NotificationContainer = connect(mapStateToProps, mapDispatchToProps)(Notification);

export default NotificationContainer;
