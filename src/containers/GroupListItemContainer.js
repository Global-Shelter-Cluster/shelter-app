// @flow

import React from 'react';
import {connect} from 'react-redux';
import GroupListItem from '../components/GroupListItem';
import {getObject, OBJECT_MODE_STUB} from "../model";
import {withNavigation} from 'react-navigation';
import type {GroupObject} from "../model/group";
import {getRecentDocumentsCount} from "../model/group";
import {convertFiles} from "../model/file";

const mapStateToProps = (state, props) => {
  const group: GroupObject = getObject(state, 'group', props.id);

  const ret = {
    group: group,
    link: props.noLink ? false : (state.online || group._mode !== OBJECT_MODE_STUB),
    enter: (id: number) => props.navigation.push('Group', {groupId: id}),
  };

  if (props.display === 'full') {
    ret.factsheet = group.latest_factsheet ? convertFiles(state, 'factsheet', getObject(state, 'factsheet', group.latest_factsheet)) : null;
    ret.recentDocs = getRecentDocumentsCount(state, props.id);
  }

  return ret;
};

export default withNavigation(connect(mapStateToProps)(GroupListItem));
