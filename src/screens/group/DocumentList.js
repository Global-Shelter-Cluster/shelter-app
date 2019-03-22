// @flow

import React from 'react';
import {FlatList, View, RefreshControl} from 'react-native';
import type {PublicGroupObject} from "../../model/group";
import DocumentListItemContainer from "../../containers/DocumentListItemContainer";
import type {tabsDefinition} from "../../components/Tabs";
import Tabs from "../../components/Tabs";
import i18n from "../../i18n";

export type tabs = "recent" | "featured" | "key";

export default ({online, loading, tab, group, refresh, changeTab}: {
  online: boolean,
  loading: boolean,
  tab: tabs,
  group: PublicGroupObject,
  refresh: () => void,
  changeTab: (tab: tabs) => void,
}) => {
  let ids: Array<number> = [];

  switch (tab) {
    case "recent":
      ids = group.recent_documents ? group.recent_documents : [];
      break;
    case "featured":
      ids = group.featured_documents ? group.featured_documents : [];
      break;
    case "key":
      ids = group.key_documents ? group.key_documents : [];
      break;
  }

  const tabs: tabsDefinition = {
    "recent": {label: i18n.t("Recent")},
    "featured": {label: i18n.t("Featured")},
    "key": {label: i18n.t("Key")},
  };

  if (group.recent_documents === undefined || group.recent_documents.length === 0)
    delete tabs.recent;
  if (group.featured_documents === undefined || group.featured_documents.length === 0)
    delete tabs.featured;
  if (group.key_documents === undefined || group.key_documents.length === 0)
    delete tabs.key;

  return <View style={{flex: 1}}>
    <Tabs
      current={tab}
      changeTab={changeTab}
      tabs={tabs}
    />
    {ids !== undefined && <FlatList
      key={tab} // This makes the list scroll up when changing the tab.
      data={ids.map(id => ({key: '' + id, id: id}))}
      renderItem={({item}) => <DocumentListItemContainer id={item.id}/>}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
    />}
  </View>;
}
