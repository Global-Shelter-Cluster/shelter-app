// @flow

import React from 'react';
import {connect} from 'react-redux';
import GroupListItem from '../components/GroupListItem';
import {getObject} from "../model";

const mapStateToProps = (state, props) => {
  const group = getObject(state, 'group', props.id);

  return {
    group: group,
    factsheet: group.latest_factsheet ? getObject(state, 'factsheet', group.latest_factsheet) : null,
    enter: (id: number) => props.navigation.navigate('Group', {groupId: id}),
  };
};

export default connect(mapStateToProps)(GroupListItem);
