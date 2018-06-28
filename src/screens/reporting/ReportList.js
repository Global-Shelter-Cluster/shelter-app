// @flow

import React from 'react';
import {FlatList, RefreshControl, View} from 'react-native';
import type {PrivateGroupObject} from "../../model/group";
import ReportListItemContainer from "../../containers/ReportListItemContainer";
import type {tabsDefinition} from "../../components/Tabs";
import Tabs from "../../components/Tabs";

export default ({loading, group, refresh}: {
  loading: boolean,
  group: PrivateGroupObject,
  refresh: () => {},
}) => {
  const tabs: tabsDefinition = {
    "all": {label: "Assessment forms"},
  };
  const tab = 'all';

  return <View style={{flex: 1}}>
    <Tabs
      current={tab}
      changeTab={() => {}}
      tabs={tabs}
    />
    {group.kobo_forms !== undefined && <FlatList
      data={group.kobo_forms.map(id => ({key: '' + id, id: id}))}
      renderItem={({item}) => <ReportListItemContainer id={item.id}/>}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
    />}
  </View>;
}
