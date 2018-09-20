// @flow

import React from 'react';
import {connect} from 'react-redux';
import GroupActions from '../components/GroupActions';
import {withNavigation} from 'react-navigation';
import {followGroup, unfollowGroup} from "../actions";
import {isFollowing} from "../model/group";
import {getCurrentUser, MAX_FOLLOWED_GROUPS} from "../model/user";

const mapStateToProps = (state, props) => ({
  online: state.flags.online,
  changingFollowing: state.flags.following,
  isFollowing: isFollowing(state, props.group.id),
  cantFollow: getCurrentUser(state).groups !== undefined && getCurrentUser(state).groups.length >= MAX_FOLLOWED_GROUPS,
  viewOnWebsite: () => props.navigation.push('WebsiteViewer', {title: props.group.title, url: props.group.url}),
});

const mapDispatchToProps = (dispatch, props) => ({
  follow: () => {
    dispatch(followGroup(props.group.id));
  },
  unfollow: () => {
    dispatch(unfollowGroup(props.group.id));
  },
});

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(GroupActions));
