// @flow

import {connect} from 'react-redux';
import {withNavigation} from 'react-navigation';
import {getRecentDocumentsCount, isFollowing} from "../model/group";
import GroupDashboard from "../components/GroupDashboard";
import type {DashboardBlockType} from "../components/DashboardBlock";
import {getCurrentUser} from "../model/user";

const mapStateToProps = (state, {group, navigation, follow, unfollow}) => {
  const blocks: Array<DashboardBlockType> = [];

  if (isFollowing(state, group.id))
    blocks.push({
      title: 'Un-follow this\n' + group.type.replace('_', ' '),
      icon: 'sign-out',
      action: unfollow,
    });
  else if (getCurrentUser(state).groups !== undefined && getCurrentUser(state).groups.length >= 5)
    blocks.push({
      title: 'Can\'t follow\n(too many)',
      icon: 'sign-in',
      disabledIcon: 'ban',
    });
  else
    blocks.push({
      title: 'Follow this\n' + group.type.replace('_', ' '),
      icon: 'sign-in',
      action: follow,
    });

  if (state.flags.online)
    blocks.push({
      title: 'View on\nwebsite',
      icon: 'external-link',
      action: () => navigation.push('WebsiteViewer', {title: group.title, url: group.url}),
    });
  else
    blocks.push({
      title: 'View on\nwebsite',
      icon: 'external-link',
      disabledIcon: 'wifi',
    });

  const recentDocs = getRecentDocumentsCount(state, group.id);
  if (recentDocs > 0)
    blocks.push({
      title: 'Recent\ndocuments',
      badge: recentDocs,
      icon: 'file-o',
      action: () => navigation.push('DocumentList', {groupId: group.id, which: "recent"}),
    });
  else if (group.featured_documents && group.featured_documents.length > 0)
    blocks.push({
      title: 'Featured\ndocuments',
      icon: 'file-o',
      action: () => navigation.push('DocumentList', {groupId: group.id, which: "featured"}),
    });
  else if (group.key_documents && group.key_documents.length > 0)
    blocks.push({
      title: 'Key\ndocuments',
      icon: 'file-o',
      action: () => navigation.push('DocumentList', {groupId: group.id, which: "key"}),
    });
  else if (group.recent_documents && group.recent_documents.length > 0)
    blocks.push({
      title: 'All\nDocuments',
      icon: 'file-o',
      action: () => navigation.push('DocumentList', {groupId: group.id, which: "recent"}),
    });

  if (group.upcoming_events && group.upcoming_events.length > 0)
    blocks.push({
      title: 'Upcoming\nevents',
      badge: group.upcoming_events.length,
      icon: 'calendar',
      action: () => navigation.push('EventList', {groupId: group.id}),
    });

  if (group.latest_factsheet)
    blocks.push({
      title: 'Latest\nfactsheet',
      icon: 'bar-chart',
      action: () => navigation.push('Factsheet', {factsheetId: group.latest_factsheet}),
    });

  return {
    // group,
    blocks,
  };
};

export default GroupDashboardContainer = withNavigation(connect(mapStateToProps)(GroupDashboard));
