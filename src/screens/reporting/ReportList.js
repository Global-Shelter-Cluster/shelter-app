// @flow

import React from 'react';
import {FlatList, RefreshControl, View} from 'react-native';
import type {PublicGroupObject} from "../../model/group";
import ReportListItemContainer from "../../containers/ReportListItemContainer";

export default ({loading, group, refresh}: {
  loading: boolean,
  group: PublicGroupObject,
  refresh: () => {},
}) => {
  group.kobo_forms.push(group.kobo_forms[0]);
  
  return <View style={{flex: 1}}>
    {group.kobo_forms !== undefined && <FlatList
      data={group.kobo_forms.map(id => ({key: '' + id, id: id}))}
      renderItem={({item}) => <ReportListItemContainer id={item.id}/>}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
    />}
  </View>;
}
