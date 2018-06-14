// @flow

import React from 'react';
import {View} from 'react-native';
import DocumentListItem from './DocumentListItem';
import type {PublicDocumentObject} from "../model/document";

export default Document = ({document}: { document: PublicDocumentObject }) => (
  <View>
    <DocumentListItem document={document}/>
  </View>
);
