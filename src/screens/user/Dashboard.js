// @flow

import React from 'react';
import TestContainer from '../../containers/TestContainer';
import {FlatList, RefreshControl, View} from 'react-native';
import type {PrivateUserObject} from "../../model/user";
import UserContainer from "../../containers/UserContainer";
import GroupListItemContainer from '../../containers/GroupListItemContainer';

export default ({user, loading, refreshUser}: {
  user: PrivateUserObject,
  loading: boolean,
  refreshUser: () => {},
}) => (
  <View style={{flex: 1}}>
    <UserContainer user={user} showEdit={true}/>
    {user.groups !== undefined && <FlatList
      data={user.groups.map(id => ({key: '' + id, id: id}))}
      renderItem={({item}) => <GroupListItemContainer display="full" id={item.id}/>}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refreshUser}/>}
    />}
    <TestContainer/>
  </View>
);
