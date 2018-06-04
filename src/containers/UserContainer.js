// @flow

import React from 'react';
import {connect} from 'react-redux';
import User from '../components/User';
import {withNavigation} from 'react-navigation';

const mapStateToProps = (state, props) => ({
  showEdit: props.showEdit && state.online,
  edit: () => props.navigation.navigate('Edit'),
});

export default withNavigation(connect(mapStateToProps)(User));
