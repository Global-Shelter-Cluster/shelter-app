// @flow

import React from 'react';
import {connect} from 'react-redux';
import DocumentListItem from '../components/DocumentListItem';
import {getObject} from "../model";
import {withNavigation} from 'react-navigation';
import {convertFiles} from "../model/file";
import type {DocumentObject} from "../model/document";

const mapStateToProps = (state, props) => {
  const document: DocumentObject = convertFiles(state, 'document', getObject(state, 'document', props.id));

  const ret = {
    document: document,
    // link: props.noLink ? false : (state.online || group._mode !== OBJECT_MODE_STUB),
    // enter: (id: number) => props.navigation.push('Group', {groupId: id}),
  };

  console.log('dddoc', props, ret);
  // if (props.display === 'full') {
  //   ret.factsheet = group.latest_factsheet ? convertFiles(state, 'factsheet', getObject(state, 'factsheet', group.latest_factsheet)) : null;
  //   ret.recentDocs = getRecentDocumentsCount(state, props.id);
  // }

  return ret;
};

export default withNavigation(connect(mapStateToProps)(DocumentListItem));
