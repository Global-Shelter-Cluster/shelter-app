// @flow

import React from 'react';
import {FlatList, Image, RefreshControl, StyleSheet, Text, TextInput, View} from 'react-native';
import type {tabsDefinition} from "../../components/Tabs";
import Tabs from "../../components/Tabs";
import type {GlobalObject} from "../../model/global";
import {InstantSearch} from 'react-instantsearch/native';
import {connectHighlight, connectInfiniteHits, connectSearchBox} from 'react-instantsearch/connectors';
import vars from "../../vars";

const Highlight = connectHighlight(
  ({highlight, attribute, hit}) => {
    const parsedHit = highlight({
      attribute,
      hit,
      highlightProperty: '_highlightResult',
    });
    const highlightedHit = parsedHit.map((part, idx) => {
      if (part.isHighlighted)
        return (
          <Text key={idx} style={{fontWeight: 'bold'}}>
            {part.value}
          </Text>
        );
      return part.value;
    });
    return <Text>{highlightedHit}</Text>;
  }
);

const Hits = connectInfiniteHits(({hits, hasMore, refine}) => {
  const onEndReached = function () {
    if (hasMore)
      refine();
  };

  hits = hits.filter(item => item.objectID !== null);
  hits.push({objectID: null});

  return (
    <FlatList
      data={hits}
      onEndReached={onEndReached}
      keyExtractor={item => item.objectID}
      renderItem={({item}) => {
        if (item.objectID === null)
          return <View style={{height: 300}}/>
        // console.log(item);

        return (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1}}>
              <Text>
                <Highlight attribute="title" hit={item}/>
              </Text>
              <Text>
                {item.type}
              </Text>
            </View>
          </View>
        );
      }}
    />
  );
});

export type tabs = "documents" | "events" | "groups" | "pages" | "contacts";

const SearchBox = connectSearchBox(({refine, currentRefinement}) => {
  const styles = {
    fontSize: 22,
    height: 45,
    borderWidth: StyleSheet.hairlineWidth,
    borderTopWidth: 0,
    borderColor: vars.SHELTER_DARK_BLUE,
    padding: 10,
    marginHorizontal: 20,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  };

  return (
    <TextInput
      style={styles}
      onChangeText={text => refine(text)}
      value={currentRefinement}
      placeholder={'Search...'}
      clearButtonMode={'always'}
      spellCheck={false}
      autoCorrect={false}
      autoCapitalize={'none'}
    />
  );
});

export default ({online, loading, tab, global, changeTab}: {
  online: boolean,
  loading: boolean,
  tab: tabs,
  global: GlobalObject,
  changeTab: (tab: string) => {},
}) => {
  const tabs: tabsDefinition = {
    "documents": {label: "Documents", icon: "file-o"},
    "events": {label: "Events", icon: "calendar"},
    "groups": {label: "Groups", icon: "users"},
    "pages": {label: "Pages", icon: "globe"},
    "contacts": {label: "Contacts", icon: "address-card-o"},
  };

  const indexName = global.algolia_prefix + tab.charAt(0).toUpperCase() + tab.substr(1);

  return <View style={{flex: 1}}>
    <Tabs
      labelOnlyOnActive
      startsVisualGroup
      current={tab}
      changeTab={changeTab}
      tabs={tabs}
    />
    <InstantSearch
      key={tab}
      appId={global.algolia_app_id} apiKey={global.algolia_search_key} indexName={indexName}
    >
      <SearchBox/>
      <Hits/>
    </InstantSearch>
  </View>;
}
