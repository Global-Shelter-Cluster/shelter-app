// @flow

import React from 'react';
import {connect} from 'react-redux';
import DocumentListItem from '../components/DocumentListItem';
import {withNavigation} from 'react-navigation';
import type {StubDocumentObject} from "../model/document";

const mapStateToProps = (state, props) => {
  const title = props.result._highlightResult !== undefined && props.result._highlightResult.title !== undefined
    ? props.result._highlightResult.title.value
    : '';

  const document: StubDocumentObject = {
    id: parseInt(props.result.objectID, 10),
    title: title, // TODO: this doesn't account for matchedWords
    date: props.result.document_date * 1000,
    preview: props.result['field_preview:file:url'],
  };

  const ret = {document};
  if (state.flags.online)
    ret.enter = () => props.navigation.push('Document', {documentId: document.id});

  return ret;
};

export default withNavigation(connect(mapStateToProps)(DocumentListItem));
