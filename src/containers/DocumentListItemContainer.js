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

  return {
    document: document,
    link: state.flags.online || detailLevels[document._mode] >= detailLevels[OBJECT_MODE_PUBLIC],
    enter: (id: number) => props.navigation.push('Document', {documentId: id}),
  };
};

export default withNavigation(connect(mapStateToProps)(DocumentListItem));
