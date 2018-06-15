// @flow

import React from 'react';
import {connect} from 'react-redux';
import EventActions from '../components/EventActions';
import {withNavigation} from 'react-navigation';

const mapStateToProps = state => ({
  online: state.flags.online,
});

export default withNavigation(connect(mapStateToProps)(EventActions));
