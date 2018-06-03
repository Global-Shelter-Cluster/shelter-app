// @flow

import React from 'react';
import TestContainer from '../../containers/TestContainer';
import {View} from 'react-native';
import type {PrivateUserObject} from "../../model/user";
import UserContainer from "../../containers/UserContainer";
import FollowedGroups from "../../components/FollowedGroups";

export default ({user, navigation}: { user: PrivateUserObject, navigation: {} }) => (
  <View style={{
    flex: 1,
  }}>
    <UserContainer user={user} showEdit={true} navigation={navigation}/>
    <FollowedGroups ids={user.groups} navigation={navigation}/>
    <TestContainer/>
  </View>
);
