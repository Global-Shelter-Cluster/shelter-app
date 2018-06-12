// @flow

import React from 'react';
import TestContainer from '../../containers/TestContainer';
import {FlatList, View} from 'react-native';
import type {PrivateUserObject} from "../../model/user";
import UserContainer from "../../containers/UserContainer";
import GroupListItemContainer from '../../containers/GroupListItemContainer';

export default ({user}: { user: PrivateUserObject }) => (
  <View style={{flex: 1}}>
    <UserContainer user={user} showEdit={true}/>
    <FlatList
      data={user.groups.map(id => ({key: '' + id, id: id}))}
      renderItem={({item}) => <GroupListItemContainer display="full" id={item.id}/>}
    />
    {/*<FollowedGroups ids={user.groups}/>*/}
    <TestContainer/>
  </View>
);
