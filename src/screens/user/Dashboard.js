// @flow

import React from 'react';
import {FlatList, RefreshControl, ScrollView, Text, View} from 'react-native';
import type {PrivateUserObject} from "../../model/user";
import UserContainer from "../../containers/UserContainer";
import GroupListItemContainer from '../../containers/GroupListItemContainer';

export default ({user, loading, refresh}: {
  user: PrivateUserObject,
  loading: boolean,
  refresh: () => {},
}) => (
  <ScrollView
    style={{flex: 1}}
    refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
  >
    <UserContainer user={user} showEdit={true}/>
    {
      user.groups !== undefined
        ? user.groups.map(id => <GroupListItemContainer key={'' + id} display="full" id={id}/>)
        : <Text style={{textAlign: "center", padding: 40, width: "100%"}}>You're not following any responses yet.</Text>
    }
  </ScrollView>
);
