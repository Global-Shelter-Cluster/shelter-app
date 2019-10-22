// @flow

import React from 'react';
import {FlatList, RefreshControl, StyleSheet, Text, View} from 'react-native';
import DocumentListItemContainer from "../../containers/DocumentListItemContainer";
import type {PublicArbitraryLibraryPageObject} from "../../model/page";
import HTML from '../../components/HTML';
import type {lastErrorType} from "../../reducers/lastError";
import equal from "deep-equal";
import Loading from "../../components/Loading";
import vars from "../../vars";
import ContextualNavigation from "../../components/ContextualNavigation";
import {ScrollView} from "./PhotoGallery";
import MultiLineButton from "../../components/MultiLineButton";

export default ({online, page, loaded, refresh, loading, lastError}: {
  online: boolean,
  loading: boolean,
  page: PublicArbitraryLibraryPageObject,
  loaded: boolean,
  refresh: () => void,
  lastError: lastErrorType,
}) => {
  if (!loaded && equal(lastError, {type: 'object-load', data: {type: 'page', id: page.id}}))
    return <MultiLineButton
      onPress={refresh}
      title="Error loading, please check your connection and try again"
    />;
  if (!loaded)
    return <Loading/>;

  const items: Array<{ key: string, type: "title" | "nav" | "body" | "document", id?: number }> = [];

  items.push({key: "title", type: "title"});
  items.push({key: "nav", type: "nav"});
  items.push({key: "body", type: "body"});
  items.push({key: "separator", type: "separator"});

  for (const id of page.documents) {
    items.push({key: "document:" + id, type: "document", id: id});
  }

  return <View style={{flex: 1}}>
    <FlatList
      style={{flex: 1}} // TODO: is this necessary?
      data={items}
      renderItem={({item}) => {
        switch (item.type) {
          case "title":
            return <Text style={styles.title}>{page.title}</Text>;
          case "nav":
            return <ContextualNavigation object={page}/>;
          case "body":
            return page.body !== undefined && page.body
              ? <View style={{marginHorizontal: 10}}><HTML html={page.body}/></View>
              : null;
          case "separator":
            return <View style={{height: 10}}/>;
          case "document":
            return <DocumentListItemContainer id={item.id}/>;
        }
      }}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
    />
    {/*<DocumentActionsContainer document={document}/>*/}
  </View>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
    marginBottom: 10,
    color: vars.SHELTER_RED,
  },
});
