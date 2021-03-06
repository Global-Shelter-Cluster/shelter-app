// @flow

import {connect} from 'react-redux';
import GroupListItem from '../components/GroupListItem';
import {detailLevels, getObject, OBJECT_MODE_PUBLIC} from "../model";
import {withNavigation} from 'react-navigation';
import type {PublicGroupObject} from "../model/group";
import {getRecentDocumentsCount} from "../model/group";
import {convertFiles} from "../model/file";
import {getUnseenAlertIdsForGroup} from "../model/alert";
import {getCurrentUser} from "../model/user";
import {getUnseenNewsIdsForGroup} from "../model/news";

const mapStateToProps = (state, props) => {
  const group: PublicGroupObject = convertFiles(state, 'group', getObject(state, 'group', props.id));
  const followedGroups: Array<number> = getCurrentUser(state).groups !== undefined ? getCurrentUser(state).groups : [];

  const ret = {
    group: group,
    link: props.noLink ? false : (state.flags.online || detailLevels[group._mode] >= detailLevels[OBJECT_MODE_PUBLIC]),
    isFollowed: props.hideFollowedIndicator ? false : followedGroups.includes(group.id),
  };

  if (props.enterForms === undefined)
    ret.enter = () => props.navigation.push('Group', {groupId: group.id});
  else
    ret.enter = () => props.navigation.push('ReportList', {groupId: group.id});

  if (props.display === 'full') {
    ret.factsheet = group.latest_factsheet ? convertFiles(state, 'factsheet', getObject(state, 'factsheet', group.latest_factsheet)) : null;
    ret.recentDocs = getRecentDocumentsCount(state, props.id);
    ret.unseenAlerts = getUnseenAlertIdsForGroup(state, props.id).length;
    ret.unseenNews = getUnseenNewsIdsForGroup(state, props.id).length;
  }

  return ret;
};

export default withNavigation(connect(mapStateToProps)(GroupListItem));
