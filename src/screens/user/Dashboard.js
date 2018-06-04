// @flow

import React from 'react';
import TestContainer from '../../containers/TestContainer';
import {View} from 'react-native';
import type {PrivateUserObject} from "../../model/user";
import UserContainer from "../../containers/UserContainer";
import FollowedGroups from "../../components/FollowedGroups";

export default ({user}: { user: PrivateUserObject }) => (
  <View style={{
    flex: 1,
  }}>
    <UserContainer user={user} showEdit={true}/>
    <FollowedGroups ids={user.groups}/>
    <TestContainer/>
  </View>
);
