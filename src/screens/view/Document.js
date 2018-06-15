// @flow

import React from 'react';
import {Image, Linking, RefreshControl, ScrollView, Share, StyleSheet, Text, View} from 'react-native';
import type {PublicDocumentObject} from "../../model/document";
import DocumentContextualNavigation from "../../components/DocumentContextualNavigation";
import DocumentActionsContainer from "../../containers/DocumentActionsContainer";
import type {FactsheetObject} from "../../model/factsheet";
import equal from 'deep-equal';
import type {lastErrorType} from "../../reducers/lastError";
import Button from "../../components/Button";
import vars from "../../vars";
import HTML from 'react-native-render-html';
import moment from "moment/moment";
import Loading from "../../components/Loading";

export default ({online, document, loaded, factsheet, refresh, loading, lastError, navigation}: {
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
    return <Loading/>;

  console.log('doc desc', document.description);

  return <View style={{flex: 1}}>
    <ScrollView
      style={{flex: 1}}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
    >
      <Text style={styles.title}>{document.title}</Text>
      <Text style={styles.secondary}>{moment(document.date).format('D MMM YYYY')}</Text>
      <DocumentContextualNavigation document={document}/>
      <View style={styles.info}>
        {document.preview !== undefined && document.preview &&
        <Image key="preview" style={styles.preview} source={{uri: document.preview}}/>}
        {document.description !== undefined && document.description && <HTML html={document.description}/>}
      </View>
    </ScrollView>
    <DocumentActionsContainer document={document}/>
  </View>;
}

const styles = StyleSheet.create({
  info: {
    flexDirection: "row",
    margin: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
    marginBottom: 5,
    color: vars.SHELTER_RED,
  },
  secondary: {
    color: vars.SHELTER_GREY,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  preview: {
    width: 120,
    height: 120,
    resizeMode: "cover",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: vars.SHELTER_GREY,
    marginRight: 10,
  },
});
