// @flow

import React from 'react';
import {connect} from 'react-redux';
import GroupListItem from '../components/GroupListItem';
import {detailLevels, getObject, OBJECT_MODE_PUBLIC} from "../model";
import {withNavigation} from 'react-navigation';
import type {PublicGroupObject} from "../model/group";
import {getRecentDocumentsCount} from "../model/group";
import {convertFiles} from "../model/file";

const mapStateToProps = (state, props) => {
  const group: PublicGroupObject = convertFiles(state, 'group', getObject(state, 'group', props.id));

  const ret = {
    group: group,
    link: props.noLink ? false : (state.flags.online || detailLevels[group._mode] >= detailLevels[OBJECT_MODE_PUBLIC]),
    enter: (id: number) => props.navigation.push('Group', {groupId: id}),
  };

  if (props.display === 'full') {
    ret.factsheet = group.latest_factsheet ? convertFiles(state, 'factsheet', getObject(state, 'factsheet', group.latest_factsheet)) : null;
    ret.recentDocs = getRecentDocumentsCount(state, props.id);
  }

  return ret;
};

export default withNavigation(connect(mapStateToProps)(GroupListItem));
