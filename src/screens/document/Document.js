// @flow

import React from 'react';
import {RefreshControl, ScrollView, Text, Linking} from 'react-native';
import type {PublicDocumentObject} from "../../model/document";
import DocumentContextualNavigation from "../../components/DocumentContextualNavigation";
import type {FactsheetObject} from "../../model/factsheet";
import equal from 'deep-equal';
import type {lastErrorType} from "../../reducers/lastError";
import Document from "../../components/Document";
import Button from "../../components/Button";
import vars from "../../vars";

export default ({online, document, loaded, factsheet, refresh, loading, lastError}: {
  online: boolean,
  loading: boolean,
  document: PublicDocumentObject,
  loaded: boolean,
  factsheet?: FactsheetObject,
  refresh: () => {},
  lastError: lastErrorType,
}) => {
  if (!loaded && equal(lastError, {type: 'object-load', data: {type: 'document', id: document.id}}))
    return <Button
      onPress={refresh}
      title="Error loading, please check your connection and try again"
    />;
  if (!loaded)
    return <Text>Loading...</Text>;

  return <ScrollView
    refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
  >
    <Text style={{fontSize: 20, fontWeight: "bold", margin: 10, color: vars.SHELTER_RED}}>{document.title}</Text>
    <DocumentContextualNavigation document={document}/>
    <Button primary title="View" onPress={() => {Linking.openURL(document.file)}}/>
    <Button primary title="View map on iOS" onPress={() => {Linking.openURL("http://maps.apple.com/?ll=37.484847,-122.148386")}}/>
    <Button primary title="View map" onPress={() => {Linking.openURL("geo:37.484847,-122.148386")}}/>
    {/*<Document document={document}/>*/}
  </ScrollView>;
}
