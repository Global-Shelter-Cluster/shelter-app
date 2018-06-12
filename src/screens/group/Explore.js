// @flow

import React from 'react';
import {FlatList, View} from 'react-native';
import Tabs from "../../components/Tabs";
import type {PrivateUserObject} from "../../model/user";
import GroupListItemContainer from '../../containers/GroupListItemContainer';

export type tabs = "followed" | "featured" | "search";

export default ({online, tab, user, changeTab}: {
  online: boolean,
  tab: tabs,
  user: PrivateUserObject,
  changeTab: (tab: string) => {},
}) => {
  let ids: Array<number> = [];

  switch (tab) {
    case "followed":
      ids = user.groups;
      break;
    case "featured":
      ids = []; //TODO
      break;
    // case "search":
    //   ids = group.key_documents;
    //   break;
  }

  const tabs = {"followed": {label: "Followed"}, "featured": {label: "Featured"}, "search": {label: "Search"}};

  if (!online)
    tabs.search.disabledIcon = 'wifi';

  return <View style={{flex: 1}}>
    <Tabs
      current={tab}
      changeTab={changeTab}
      tabs={tabs}
    />
    <FlatList
      key={tab} // This makes the list scroll up when changing the tab.
      data={ids.map(id => ({key: '' + id, id: id}))}
      renderItem={({item}) => <GroupListItemContainer display="full" id={item.id}/>}
    />
  </View>;
}
