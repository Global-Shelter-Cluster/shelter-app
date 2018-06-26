// @flow

import React from 'react';
import {connect} from 'react-redux';
import DocumentListItem from '../components/DocumentListItem';
import {detailLevels, getObject, OBJECT_MODE_PUBLIC} from "../model";
import {withNavigation} from 'react-navigation';
import {convertFiles} from "../model/file";
import type {DocumentObject} from "../model/document";

const mapStateToProps = (state, props) => {
  const document: DocumentObject = convertFiles(state, 'document', getObject(state, 'document', props.id));
  const hasLink = state.flags.online || detailLevels[document._mode] >= detailLevels[OBJECT_MODE_PUBLIC];

  const ret = {document};
  if (hasLink)
    ret.enter = () => props.navigation.push('Document', {documentId: document.id});

  return ret;
};

export default withNavigation(connect(mapStateToProps)(DocumentListItem));
