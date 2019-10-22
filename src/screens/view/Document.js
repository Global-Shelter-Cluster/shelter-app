// @flow

import React from 'react';
import {Image, Linking, RefreshControl, ScrollView, Share, StyleSheet, Text, View} from 'react-native';
import type {PublicDocumentObject} from "../../model/document";
import ContextualNavigation from "../../components/ContextualNavigation";
import DocumentActionsContainer from "../../containers/DocumentActionsContainer";
import equal from 'deep-equal';
import type {lastErrorType} from "../../reducers/lastError";
import vars from "../../vars";
import HTML from '../../components/HTML';
import moment from "moment/moment";
import Loading from "../../components/Loading";
import {hairlineWidth} from "../../util";
import MultiLineButton from "../../components/MultiLineButton";

export default ({online, document, loaded, refresh, loading, lastError}: {
  online: boolean,
  loading: boolean,
  document: PublicDocumentObject,
  loaded: boolean,
  refresh: () => void,
  lastError: lastErrorType,
}) => {
  if (!loaded && equal(lastError, {type: 'object-load', data: {type: 'document', id: document.id}}))
    return <MultiLineButton
      onPress={refresh}
      title="Error loading, please check your connection and try again"
    />;
  if (!loaded)
    return <Loading/>;

  return <View style={{flex: 1}}>
    <ScrollView
      style={{flex: 1}}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
    >
      <Text style={styles.title}>{document.title}</Text>
      <Text style={styles.secondary}>{moment(document.date).utc().format('D MMM YYYY')}</Text>
      <ContextualNavigation object={document}/>
      <View style={styles.info}>
        {document.preview !== undefined && document.preview &&
        <Image key="preview" style={styles.preview} source={{uri: document.preview}}/>}
        <View style={{flex: 1}}>
          {document.description !== undefined && document.description && <HTML html={document.description}/>}
        </View>
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
    borderWidth: hairlineWidth,
    borderColor: vars.SHELTER_GREY,
    marginRight: 10,
  },
});
