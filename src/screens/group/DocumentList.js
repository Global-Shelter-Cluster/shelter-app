// @flow

import React from 'react';
import {FlatList, View} from 'react-native';
import type {PublicGroupObject} from "../../model/group";
import DocumentListItemContainer from "../../containers/DocumentListItemContainer";
import Tabs from "../../components/Tabs";

export type tabs = "recent" | "featured" | "key";

export default ({online, tab, group, changeTab}: {
  online: boolean,
  tab: tabs,
  group: PublicGroupObject,
  changeTab: (tab: string) => {},
}) => {
  let ids: Array<number> = [];

  switch (tab) {
    case "recent":
      ids = group.recent_documents;
      break;
    case "featured":
      ids = group.featured_documents;
      break;
    case "key":
      ids = group.key_documents;
      break;
  }

  return <View style={{flex: 1}}>
    <Tabs
      current={tab}
      changeTab={changeTab}
      tabs={{"recent": {label: "Recent"}, "featured": {label: "Featured"}, "key": {label: "Key"}}}
    />
    <FlatList
      key={tab} // This makes the list scroll up when changing the tab.
      data={ids.map(id => ({key: '' + id, id: id}))}
      renderItem={({item}) => <DocumentListItemContainer id={item.id}/>}
    />
  </View>;
}
