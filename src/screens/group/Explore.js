// @flow

import React from 'react';
import {FlatList, RefreshControl, View} from 'react-native';
import type {tabsDefinition} from "../../components/Tabs";
import Tabs from "../../components/Tabs";
import type {PrivateUserObject} from "../../model/user";
import GroupListItemContainer from '../../containers/GroupListItemContainer';
import type {GlobalObject} from "../../model/global";

export type tabs = "followed" | "featured" | "regions";

export default ({online, loading, tab, global, user, changeTab, refreshGlobal, refreshUser}: {
  online: boolean,
  loading: boolean,
  tab: tabs,
  global: GlobalObject,
  user: PrivateUserObject,
  changeTab: (tab: tabs) => void,
  refreshGlobal: () => void,
  refreshUser: () => void,
}) => {
  let ids: Array<number> = [];

  const tabs: tabsDefinition = {
    "followed": {label: "Followed"},
    "featured": {label: "Featured"},
    "regions": {label: "Regions"},
  };

  if (user.groups === undefined || user.groups.length === 0)
    delete tabs.followed;
  if (global.featured_groups === undefined || global.featured_groups.length === 0)
    delete tabs.featured;
  if (global.top_regions === undefined || global.top_regions.length === 0)
    delete tabs.regions;

  switch (tab) {
    case "followed":
      ids = user.groups !== undefined ? user.groups : [];
      break;
    case "featured":
      ids = global.featured_groups ? global.featured_groups : [];
      break;
    case "regions":
      ids = global.top_regions ? global.top_regions : [];
      break;
  }

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
    case 'regions':
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
