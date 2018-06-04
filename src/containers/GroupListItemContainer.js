// @flow

import React from 'react';
import {connect} from 'react-redux';
import GroupListItem from '../components/GroupListItem';
import {getObject} from "../model";
import {withNavigation} from 'react-navigation';
import type {GroupObject} from "../model/group";
import {OBJECT_MODE_STUB} from "../model/index";

const mapStateToProps = (state, props) => {
  const group: GroupObject = getObject(state, 'group', props.id);

  return {
    group: group,
    link: props.noLink ? false : (state.online || group._mode !== OBJECT_MODE_STUB),
    factsheet: group.latest_factsheet ? getObject(state, 'factsheet', group.latest_factsheet) : null,
    enter: (id: number) => props.navigation.push('Group', {groupId: id}),
  };
};

export default withNavigation(connect(mapStateToProps)(GroupListItem));
