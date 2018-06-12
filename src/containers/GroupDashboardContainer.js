// @flow

import React from 'react';
import {connect} from 'react-redux';
import {getObject} from "../model";
import {withNavigation} from 'react-navigation';
import type {PublicGroupObject} from "../model/group";
import {getRecentDocumentsCount} from "../model/group";
import {convertFiles} from "../model/file";
import GroupDashboard from "../components/GroupDashboard";

const mapStateToProps = (state, props) => {
  const group: PublicGroupObject = convertFiles(state, 'group', getObject(state, 'group', props.id));

  const blocks: Array<{ title: string, icon: string, action: () => {} }> = [];

  if (state.flags.online)
    blocks.push({
      title: 'View on\nwebsite',
      icon: 'external-link',
      action: () => props.navigation.push('WebsiteViewer', {title: group.title, url: group.url}),
    });
  else
    blocks.push({
      title: 'View on\nwebsite',
      icon: 'external-link',
      disabledIcon: 'wifi',
    });

  const recentDocs = getRecentDocumentsCount(state, props.id);
  if (recentDocs > 0)
    blocks.push({
      title: 'Recent\ndocuments',
      badge: recentDocs,
      icon: 'file-o',
      action: () => props.navigation.push('DocumentList', {groupId: group.id, which: "recent"}),
    });
  else if (group.featured_documents.length > 0)
    blocks.push({
      title: 'Featured\ndocuments',
      icon: 'file-o',
      action: () => props.navigation.push('DocumentList', {groupId: group.id, which: "featured"}),
    });
  else if (group.key_documents.length > 0)
    blocks.push({
      title: 'Key\ndocuments',
      icon: 'file-o',
      action: () => props.navigation.push('DocumentList', {groupId: group.id, which: "key"}),
    });
  else if (group.recent_documents.length > 0)
    blocks.push({
      title: 'Documents',
      icon: 'file-o',
      action: () => props.navigation.push('DocumentList', {groupId: group.id, which: "recent"}),
    });

  blocks.push({
    title: 'Upcoming\nevents',
    icon: 'calendar',
    action: () => {},
  });

  if (group.latest_factsheet)
    blocks.push({
      title: 'Latest\nfactsheet',
      icon: 'bar-chart',
      action: () => {},
    });

  const ret = {
    // group: group,
    blocks,
  };

  // if (props.display === 'full') {
  //   ret.factsheet = group.latest_factsheet ? convertFiles(state, 'factsheet', getObject(state, 'factsheet', group.latest_factsheet)) : null;
  //   ret.recentDocs = getRecentDocumentsCount(state, props.id);
  // }

  return ret;
};

export default withNavigation(connect(mapStateToProps)(GroupDashboard));
