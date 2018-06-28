// @flow

import React from 'react';
import {FlatList, RefreshControl, View} from 'react-native';
import type {PrivateGroupObject} from "../../model/group";
import AlertListItemContainer from "../../containers/AlertListItemContainer";
import type {tabsDefinition} from "../../components/Tabs";
import Tabs from "../../components/Tabs";

export type tabs = "new";

export default ({online, loading, tab, group, refresh, changeTab}: {
  online: boolean,
  loading: boolean,
  tab: tabs,
  group: PrivateGroupObject,
  refresh: () => {},
  changeTab: (tab: string) => {},
}) => {
  let ids: Array<number> = [];

  switch (tab) {
    case "new":
      ids = group.alerts !== undefined ? group.alerts : [];
      break;
  }

  const tabs: tabsDefinition = {
    "new": {label: "Alerts"},
  };

  return <View style={{flex: 1}}>
    <Tabs
      current={tab}
      changeTab={changeTab}
      tabs={tabs}
    />
    {ids !== undefined && <FlatList
      key={tab} // This makes the list scroll up when changing the tab.
      data={ids.map(id => ({key: '' + id, id: id}))}
      renderItem={({item}) => <AlertListItemContainer id={item.id}/>}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
    />}
  </View>;
}
