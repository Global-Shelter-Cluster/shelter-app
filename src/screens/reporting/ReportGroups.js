// @flow

import React from 'react';
import {FlatList, RefreshControl, ScrollView, Text, View} from 'react-native';
import GroupListItemContainer from '../../containers/GroupListItemContainer';

export default ({groups, loading, refresh}: {
  groups: Array<number>,
  loading: boolean,
  refresh: () => {},
}) => (
  <ScrollView
    style={{flex: 1}}
    refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
  >
    {
      groups.length > 0
        ? groups.map(id => <GroupListItemContainer key={'' + id} display="full" id={id} enterForms/>)
        : <Text style={{textAlign: "center", padding: 40, width: "100%"}}>
          You're not following any responses that have reporting forms configured.
        </Text>
    }
  </ScrollView>
);
