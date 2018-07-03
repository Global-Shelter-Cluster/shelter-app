// @flow

import React from 'react';
import {
  FlatList,
  Image,
  Linking,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import type {tabsDefinition} from "../../components/Tabs";
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
import searchResultStyles from "../../styles/searchResultStyles";

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

export default ({online, loading, tab, global, changeTab, navigation}: {
  online: boolean,
  loading: boolean,
  tab: tabs,
  global: GlobalObject,
  changeTab: (tab: string) => {},
  navigation: { push: (string, {}) => {} },
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
        const plainTitle = item._highlightResult.title.value.replace(/<[^>]*>/g, '');
        return <PageResult
          result={item} enter={() => navigation.push('WebsiteViewer', {url: item.url, title: plainTitle})}
        />;
      },
    },
    // "contacts": {
    //   label: "Contacts",
    //   icon: "address-card-o",
    //   renderSearchResult: item => (
    //     <View style={{flexDirection: 'row', alignItems: 'center'}}>
    //       <View style={{flex: 1}}>
    //         <Text>
    //           <ResultHighlight attribute="title" hit={item}/>
    //         </Text>
    //         <Text>
    //           {item.type}
    //         </Text>
    //       </View>
    //     </View>
    //   ),
    // },
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
