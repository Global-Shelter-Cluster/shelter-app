// @flow

import React from 'react';
import {connect} from 'react-redux';
import {withNavigation} from 'react-navigation';
import {getRecentDocumentsCount} from "../model/group";
import GroupDashboard from "../components/GroupDashboard";
import type {DashboardBlockType} from "../components/DashboardBlock";

const mapStateToProps = (state, {group, navigation}) => {
  const blocks: Array<DashboardBlockType> = [];

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
  else if (group.featured_documents.length > 0)
    blocks.push({
      title: 'Featured\ndocuments',
      icon: 'file-o',
      action: () => navigation.push('DocumentList', {groupId: group.id, which: "featured"}),
    });
  else if (group.key_documents.length > 0)
    blocks.push({
      title: 'Key\ndocuments',
      icon: 'file-o',
      action: () => navigation.push('DocumentList', {groupId: group.id, which: "key"}),
    });
  else if (group.recent_documents.length > 0)
    blocks.push({
      title: 'Documents',
      icon: 'file-o',
      action: () => navigation.push('DocumentList', {groupId: group.id, which: "recent"}),
    });

  if (group.upcoming_events.length > 0)
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
      action: () => navigation.push('Factsheet', {id: group.latest_factsheet}),
    });

  return {
    // group,
    blocks,
  };
};

export default withNavigation(connect(mapStateToProps)(GroupDashboard));
