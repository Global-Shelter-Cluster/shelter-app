// @flow

import React from 'react';
import {FlatList, RefreshControl, View} from 'react-native';
import type {tabsDefinition} from "../../components/Tabs";
import Tabs from "../../components/Tabs";
import type {PrivateUserObject} from "../../model/user";
import GroupListItemContainer from '../../containers/GroupListItemContainer';
import type {GlobalObject} from "../../model/global";

export type tabs = "followed" | "featured" | "search";

export default ({online, loading, tab, global, user, changeTab, refreshGlobal, refreshUser}: {
  online: boolean,
  loading: boolean,
  tab: tabs,
  global: GlobalObject,
  user: PrivateUserObject,
  changeTab: (tab: string) => {},
  refreshGlobal: () => {},
  refreshUser: () => {},
}) => {
  let ids: Array<number> = [];

  switch (tab) {
    case "followed":
      ids = user.groups;
      break;
    case "featured":
      ids = global.featured_groups;
      break;
    // case "search":
    //   ids = group.key_documents;
    //   break;
  }

  const tabs: tabsDefinition = {
    "followed": {label: "Followed"},
    "featured": {label: "Featured"},
    // "search": {label: "Search"},
  };

  if (user.groups.length === 0)
    delete tabs.recent;
  if (global.featured_groups.length === 0)
    delete tabs.featured;

  // if (!online)
  //   tabs.search.disabledIcon = 'wifi';

  let list = null;

  switch (tab) {
    case 'followed':
      list = <FlatList
        key={tab} // This makes the list scroll up when changing the tab.
        data={ids.map(id => ({key: '' + id, id: id}))}
        renderItem={({item}) => <GroupListItemContainer display="full" id={item.id}/>}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refreshUser}/>}
      />;
      break;
    case 'featured':
      list = <FlatList
        key={tab} // This makes the list scroll up when changing the tab.
        data={ids.map(id => ({key: '' + id, id: id}))}
        renderItem={({item}) => <GroupListItemContainer display="full" id={item.id}/>}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refreshGlobal}/>}
      />;
      break;
  }

  return <View style={{flex: 1}}>
    <Tabs
      current={tab}
      changeTab={changeTab}
      tabs={tabs}
    />
    {list}
  </View>;
}
