// @flow

import {connect} from 'react-redux';
import {withNavigation} from 'react-navigation';
import {getRecentDocumentsCount, isDashboardBlockVisibleByDefault} from "../model/group";
import GroupDashboard from "../components/GroupDashboard";
import type {DashboardBlockType} from "../components/DashboardBlock";
import {getUnseenAlertIdsForGroup} from "../model/alert";

const mapStateToProps = (state, {group, navigation}) => {
  const blocks: Array<DashboardBlockType> = [];

  const unseenAlerts = getUnseenAlertIdsForGroup(state, group.id);
  if (unseenAlerts.length > 0)
    blocks.push({
      title: 'Alerts',
      badge: unseenAlerts.length,
      isBadgeHighlighted: true,
      icon: 'bell-o',
      action: () => navigation.push('AlertList', {groupId: group.id}),
    });
  else if (group.alerts !== undefined && group.alerts.length > 0)
    blocks.push({
      title: 'Alerts',
      badge: group.alerts.length,
      icon: 'bell-o',
      action: () => navigation.push('AlertList', {groupId: group.id}),
    });
  else if (isDashboardBlockVisibleByDefault(group, 'alerts'))
    blocks.push({
      title: 'Alerts',
      icon: 'bell-o',
    });

  if (group.followers !== undefined && group.followers.length > 0)
    blocks.push({
      title: 'Followers',
      badge: group.followers.length,
      icon: 'users',
      action: () => navigation.push('UserList', {groupId: group.id}),
    });
  else if (isDashboardBlockVisibleByDefault(group, 'followers'))
    blocks.push({
      title: 'Followers',
      icon: 'users',
    });

  if (group.kobo_forms)
    blocks.push({
      title: 'Assessment\nforms',
      badge: group.kobo_forms.length,
      icon: 'paper-plane-o',
      action: () => navigation.push('ReportList', {groupId: group.id}),
    });
  else if (isDashboardBlockVisibleByDefault(group, 'assessment_forms'))
    blocks.push({
      title: 'Assessment\nforms',
      icon: 'paper-plane-o',
    });

  const recentDocs = getRecentDocumentsCount(state, group.id);
  if (recentDocs > 0)
    blocks.push({
      title: 'Recent\ndocuments',
      badge: recentDocs,
      isBadgeHighlighted: true,
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
  else if (isDashboardBlockVisibleByDefault(group, 'documents'))
    blocks.push({
      title: 'Documents',
      icon: 'file-o',
    });

  if (group.upcoming_events && group.upcoming_events.length > 0)
    blocks.push({
      title: 'Upcoming\nevents',
      badge: group.upcoming_events.length,
      isBadgeHighlighted: true,
      icon: 'calendar',
      action: () => navigation.push('EventList', {groupId: group.id}),
    });
  else if (isDashboardBlockVisibleByDefault(group, 'events'))
    blocks.push({
      title: 'Events',
      icon: 'calendar',
    });

  if (group.latest_factsheet)
    blocks.push({
      title: 'Latest\nfactsheet',
      icon: 'bar-chart',
      action: () => navigation.push('Factsheet', {factsheetId: group.latest_factsheet}),
    });
  else if (isDashboardBlockVisibleByDefault(group, 'factsheets'))
    blocks.push({
      title: 'Factsheets',
      icon: 'bar-chart',
    });

  return {
    // group,
    blocks,
  };
};

export default GroupDashboardContainer = withNavigation(connect(mapStateToProps)(GroupDashboard));
