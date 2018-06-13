// @flow

import React from 'react';
import {FlatList, RefreshControl, View} from 'react-native';
import type {PublicGroupObject} from "../../model/group";
import EventListItemContainer from "../../containers/EventListItemContainer";
import type {tabsDefinition} from "../../components/Tabs";
import Tabs from "../../components/Tabs";

export type tabs = "upcoming";

export default ({online, loading, tab, group, refresh, changeTab}: {
  online: boolean,
  loading: boolean,
  tab: tabs,
  group: PublicGroupObject,
  refresh: () => {},
  changeTab: (tab: string) => {},
}) => {
  let ids: Array<number> = [];

  switch (tab) {
    case "upcoming":
      ids = group.upcoming_events;
      break;
  }

  const tabs: tabsDefinition = {
    "upcoming": {label: "Upcoming events"},
  };

  return <View style={{flex: 1}}>
    <Tabs
      current={tab}
      changeTab={changeTab}
      tabs={tabs}
    />
    <FlatList
      key={tab} // This makes the list scroll up when changing the tab.
      data={ids.map(id => ({key: '' + id, id: id}))}
      renderItem={({item}) => <EventListItemContainer id={item.id}/>}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
    />
  </View>;
}
