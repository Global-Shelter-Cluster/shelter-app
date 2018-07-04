// @flow

import React from 'react';
import {FlatList, RefreshControl, View} from 'react-native';
import type {PrivateGroupObject} from "../../model/group";
import ReportListItemContainer from "../../containers/ReportListItemContainer";
import type {tabsDefinition} from "../../components/Tabs";
import Tabs from "../../components/Tabs";
import {hairlineWidth} from "../../util";
import vars from "../../vars";

export default ({loading, group, refresh}: {
  loading: boolean,
  group: PrivateGroupObject,
  refresh: () => {},
}) => {
  const tabs: tabsDefinition = {
    "all": {label: "Assessment forms"},
  };
  const tab = 'all';

  const ids = group.kobo_forms !== undefined ? group.kobo_forms.filter(item => !!item) : [];
  if (ids.length > 0)
    ids.push(null);
  console.log('ids',ids);

  return <View style={{flex: 1}}>
    <Tabs
      current={tab}
      changeTab={() => {}}
      tabs={tabs}
    />
    {group.kobo_forms !== undefined && <FlatList
      data={ids}
      keyExtractor={item => item ? '' + item : 'end'}
      renderItem={({item}) => {
        if (item === null)
          return <View style={{
            borderColor: vars.LIGHT_GREY,
            borderTopWidth: hairlineWidth,
          }}/>;

        return <ReportListItemContainer id={item}/>;
      }}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
    />}
  </View>;
}
