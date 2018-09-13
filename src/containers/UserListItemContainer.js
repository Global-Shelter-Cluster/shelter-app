// @flow

import React from 'react';
import {connect} from 'react-redux';
import UserListItem from '../components/UserListItem';
import {getObject} from "../model";
import {withNavigation} from 'react-navigation';
import {convertFiles} from "../model/file";
import type {UserObject} from "../model/user";

const mapStateToProps = (state, props) => {
  const user: UserObject = convertFiles(state, 'user', getObject(state, 'user', props.id));

  return {
    user,
    enter: () => props.navigation.push('User', {userId: user.id}),
  };
};

export default withNavigation(connect(mapStateToProps)(UserListItem));
