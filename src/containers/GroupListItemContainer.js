// @flow

import React from 'react';
import {connect} from 'react-redux';
import GroupListItem from '../components/GroupListItem';
import {getGroup} from "../model/group";

const mapStateToProps = (state, props) => ({
  group: getGroup(props.id, state),
  enter: (id: number) => props.navigation.navigate('Group', {groupId: id}),
});

export default connect(mapStateToProps)(GroupListItem);
