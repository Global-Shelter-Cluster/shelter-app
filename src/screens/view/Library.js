// @flow

import React from 'react';
import {FlatList, RefreshControl, StyleSheet, Text, View} from 'react-native';
import DocumentListItemContainer from "../../containers/DocumentListItemContainer";
import type {PublicLibraryPageObject} from "../../model/page";
import HTML from "react-native-render-html";
import type {lastErrorType} from "../../reducers/lastError";
import equal from "deep-equal";
import Button from "../../components/Button";
import Loading from "../../components/Loading";
import vars from "../../vars";
import ContextualNavigation from "../../components/ContextualNavigation";
import {ScrollView} from "./PhotoGallery";
import {connectInfiniteHits} from "react-instantsearch/connectors";
import searchResultStyles from "../../styles/searchResultStyles";
import type {GlobalObject} from "../../model/global";

const Hits = connectInfiniteHits(({hits, hasMore, refine, renderItem}) => {
  const onEndReached = function () {
    if (hasMore)
      refine();
  };

  hits = hits.filter(item => item.objectID !== null);
  if (hits.length > 0)
    hits.push({objectID: null});

  return (
    <FlatList
      data={hits}
      onEndReached={onEndReached}
      keyExtractor={item => item.objectID}
      renderItem={({item}) => {
        if (item.objectID === null)
          return <View style={[{height: 300}, searchResultStyles.container]}/>;

        return renderItem(item);
      }}
    />
  );
});

export default ({online, page, loaded, global, refresh, loading, lastError}: {
  online: boolean,
  loading: boolean,
  page: PublicLibraryPageObject,
  loaded: boolean,
  global: GlobalObject,
  refresh: () => void,
  lastError: lastErrorType,
}) => {
  if (!loaded && equal(lastError, {type: 'object-load', data: {type: 'page', id: page.id}}))
    return <Button
      onPress={refresh}
      title="Error loading, please check your connection and try again"
    />;
  if (!loaded)
    return <Loading/>;

  const items: Array<{ key: string, type: "title" | "body" | "document", id?: number }> = [];

  items.push({key: "title", type: "title"});
  items.push({key: "nav", type: "nav"});
  items.push({key: "body", type: "body"});
  items.push({key: "separator", type: "separator"});

  // for (const id of page.documents) {
  //   items.push({key: "document:" + id, type: "document", id: id});
  // }

  return <View style={{flex: 1}}>
    <FlatList
      style={{flex: 1}} // TODO: is this necessary?
      data={items}
      renderItem={({item}) => {
        console.log("CAMrenderItem", item);
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
            // return <View style={{height: 10}}/>;
            return <Text>{JSON.stringify(page)}</Text>;
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
