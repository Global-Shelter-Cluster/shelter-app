// @flow

import React from 'react';
import {FlatList, RefreshControl, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import SearchDocumentListItemContainer from "../../containers/SearchDocumentListItemContainer";
import type {PublicLibraryPageObject} from "../../model/page";
import HTML from '../../components/HTML';
import type {lastErrorType} from "../../reducers/lastError";
import equal from "deep-equal";
import Loading from "../../components/Loading";
import vars from "../../vars";
import ContextualNavigation from "../../components/ContextualNavigation";
import {ScrollView} from "./PhotoGallery";
import {connectInfiniteHits, connectRefinementList} from "react-instantsearch/connectors";
import type {GlobalObject} from "../../model/global";
import {InstantSearch} from "react-instantsearch/native";
import {generateIndexName} from "../../model/search";
import MultiLineButton from "../../components/MultiLineButton";

const Hits = connectInfiniteHits(({hits, hasMore, refine, header, refresh}) => {
  const onEndReached = function () {
    if (hasMore)
      refine();
  };

  hits = hits.filter(item => item.objectID !== null);
  if (hits.length > 0)
    hits.push({objectID: null});

  return (
    <FlatList
      ListHeaderComponent={header}
      refreshControl={refresh}
      data={hits}
      onEndReached={onEndReached}
      keyExtractor={item => item.objectID}
      renderItem={({item}) => {
        if (item.objectID === null)
          return <View style={{height: 300}}/>;

        return <SearchDocumentListItemContainer result={item}/>;
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
    return <MultiLineButton
      onPress={refresh}
      title="Error loading, please check your connection and try again"
    />;
  if (!loaded)
    return <Loading/>;

  const indexName = generateIndexName(global, "documents_sortByDate");

  const Facet = connectRefinementList(() => null);
  const facets = [];
  if (!page.is_global_library) {
    const attribute = 'group_nids';
    facets.push(<Facet key={attribute} attribute={attribute} defaultRefinement={page.groups}/>);
  }
  for (const attribute in page.search) { // e.g. {"field_technical_support_design": {"Training materials": true, ...}, ...}
    facets.push(<Facet key={attribute} attribute={attribute} defaultRefinement={Object.keys(page.search[attribute])}/>);
  }

  return <View style={{flex: 1}}>
    <InstantSearch
      appId={global.algolia_app_id} apiKey={global.algolia_search_key} indexName={indexName}
    >
      {facets}
      <Hits
        refresh={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
        header={<View style={{marginBottom: 10}}>
          <Text style={styles.title}>{page.title}</Text>
          <ContextualNavigation object={page}/>
          {page.body !== undefined && page.body
            ? <View style={{marginHorizontal: 10}}><HTML html={page.body}/></View>
            : null
          }
        </View>}
      />
    </InstantSearch>
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
