// @flow

import React from 'react';
import {connect} from 'react-redux';
import User from '../components/User';
import {withNavigation} from 'react-navigation';
import {convertFiles} from "../model/file";

const mapStateToProps = (state, props) => ({
  showEdit: props.showEdit && state.online,
  edit: () => props.navigation.navigate('Edit'),
  user: convertFiles(state, 'user', props.user),
});

export default withNavigation(connect(mapStateToProps)(User));
