// @flow

import React from 'react';
import {FlatList, Image, Linking, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import Tabs from "../../components/Tabs";
import type {GlobalObject} from "../../model/global";
import {InstantSearch} from 'react-instantsearch/native';
import {connectInfiniteHits, connectSearchBox} from 'react-instantsearch/connectors';
import vars from "../../vars";
import {hairlineWidth} from "../../util";
import DocumentResult from "../../components/search/DocumentResult";
import EventResult from "../../components/search/EventResult";
import GroupResult from "../../components/search/GroupResult";
import PageResult from "../../components/search/PageResult";
import ContactResult from "../../components/search/ContactResult";
import searchResultStyles from "../../styles/searchResultStyles";
import type {navigation} from "../../nav";
import persist from "../../persist";
import {contactFromAlgoliaResult} from "../../model/contact";
import {getPageEnterFromSearchResult} from "../../model/page";
import {generateIndexName} from "../../model/search";

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

export type tabs = "documents" | "events" | "groups" | "pages" | "contacts";

const SearchBox = connectSearchBox(({refine, currentRefinement}) => {
  const styles = {
    fontSize: 22,
    height: 45,
    borderWidth: hairlineWidth,
    borderTopWidth: 0,
    borderColor: vars.SHELTER_DARK_BLUE,
    padding: 10,
    marginHorizontal: 20,
    marginBottom: 10,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  };

  return (
    <TextInput
      style={styles}
      onChangeText={text => refine(text)}
      value={currentRefinement}
      placeholder="Search..."
      clearButtonMode="always"
      spellCheck={false}
      autoCorrect={false}
      autoCapitalize="none"
      underlineColorAndroid="transparent"
    />
  );
});

type tabsDefinition = {
  [tab: string]: {
    label: string,
    icon?: string,
    disabledIcon?: string,
    renderSearchResult: (item: {}) => React$Element<*>,
  },
};

export default ({online, loading, tab, global, changeTab, navigation}: {
  online: boolean,
  loading: boolean,
  tab: tabs,
  global: GlobalObject,
  changeTab: (tab: tabs) => void,
  navigation: navigation,
}) => {
  const tabs: tabsDefinition = {
    "documents": {
      label: "Documents",
      icon: "file-o",
      renderSearchResult: item => <DocumentResult
        result={item} enter={() => navigation.push('Document', {documentId: parseInt(item.objectID, 10)})}
      />,
    },
    "events": {
      label: "Events",
      icon: "calendar",
      renderSearchResult: item => <EventResult
        result={item} enter={() => navigation.push('Event', {eventId: parseInt(item.objectID, 10)})}
      />,
    },
    "groups": {
      label: "Groups",
      icon: "users",
      renderSearchResult: item => <GroupResult
        result={item} enter={() => navigation.push('Group', {groupId: parseInt(item.objectID, 10)})}
      />,
    },
    "pages": {
      label: "Pages",
      icon: "globe",
      renderSearchResult: item => {
        return <PageResult
          result={item} enter={getPageEnterFromSearchResult(navigation, item)}
        />;
      },
    },
    "contacts": {
      label: "Contacts",
      icon: "address-card-o",
      renderSearchResult: item => <ContactResult
        result={item} enter={async () => {
        const objects = {contact: {[item.objectID]: contactFromAlgoliaResult(item)}};
        persist.dispatchObjects(objects);
        navigation.push('Contact', {contactId: parseInt(item.objectID, 10)});
      }}
      />,
    },
  };

  if (!global.algolia_prefix)
    return null;

  const indexName = generateIndexName(global, tab);

  return <View style={{flex: 1}}>
    <Tabs
      labelOnlyOnActive
      startsVisualGroup
      current={tab}
      changeTab={changeTab}
      tabs={tabs}
    />
    <View style={{flex: 1}}>
      <InstantSearch
        key={tab}
        appId={global.algolia_app_id} apiKey={global.algolia_search_key} indexName={indexName}
      >
        <SearchBox/>
        <Hits renderItem={tabs[tab] !== undefined ? tabs[tab].renderSearchResult : () => null}/>
      </InstantSearch>
    </View>
    <TouchableOpacity onPress={() => Linking.openURL('https://algolia.com')} style={styles.algoliaContainer}>
      <Image source={require('../../../assets/algolia.png')} style={styles.algoliaLogo}/>
    </TouchableOpacity>
  </View>;
}

const styles = StyleSheet.create({
  algoliaContainer: {
    width: "100%",
    padding: 10,
    alignItems: "center",
    backgroundColor: "#E9E9EF",
    borderColor: vars.LIGHT_GREY,
    borderTopWidth: hairlineWidth,
  },
  algoliaLogo: {
    width: 130,
    height: 19,
  },
});
