// @flow

import {connect} from 'react-redux';
import {withNavigation} from 'react-navigation';
import {getGroupTypeLabel, getRecentDocumentsCount, isFollowing} from "../model/group";
import GroupDashboard from "../components/GroupDashboard";
import type {DashboardBlockType} from "../components/DashboardBlock";
import {getCurrentUser, MAX_FOLLOWED_GROUPS} from "../model/user";
import {getUnseenAlertIdsForGroup} from "../model/alert";

const mapStateToProps = (state, {group, navigation, follow, unfollow}) => {
  const blocks: Array<DashboardBlockType> = [];

  if (state.flags.following)
    blocks.push({
      title: 'Loading...',
      icon: 'sign-in',
      disabledIcon: 'refresh',
    });
  else if (isFollowing(state, group.id))
    blocks.push({
      title: 'Un-follow this\n' + getGroupTypeLabel(group),
      icon: 'sign-out',
      action: unfollow,
    });
  else if (getCurrentUser(state).groups !== undefined && getCurrentUser(state).groups.length >= MAX_FOLLOWED_GROUPS)
    blocks.push({
      title: 'Can\'t follow\n(too many)',
      icon: 'sign-in',
      disabledIcon: 'ban',
    });
  else
    blocks.push({
      title: 'Follow this\n' + getGroupTypeLabel(group),
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

  const unseenAlerts = getUnseenAlertIdsForGroup(state, group.id);
  if (unseenAlerts.length > 0)
    blocks.push({
      title: 'Alerts',
      badge: unseenAlerts.length,
      icon: 'bell-o',
      action: () => navigation.push('AlertList', {groupId: group.id}),
    });
  else if (group.alerts !== undefined && group.alerts.length > 0)
    blocks.push({
      title: 'Alerts',
      icon: 'bell-o',
      action: () => navigation.push('AlertList', {groupId: group.id}),
    });

  if (group.kobo_forms)
    blocks.push({
      title: 'Assessment\nforms',
      badge: group.kobo_forms.length,
      icon: 'paper-plane-o',
      action: () => navigation.push('ReportList', {groupId: group.id}),
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
