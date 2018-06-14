// @flow

import React from 'react';
import {connect} from 'react-redux';
import DocumentActions from '../components/DocumentActions';
import {withNavigation} from 'react-navigation';

const mapStateToProps = state => ({
  online: state.flags.online,
});

export default withNavigation(connect(mapStateToProps)(DocumentActions));
