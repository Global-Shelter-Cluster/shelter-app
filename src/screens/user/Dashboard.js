// @flow

import React from 'react';
import TestContainer from '../../containers/TestContainer';
import {StyleSheet, View} from 'react-native';
import type {GroupObject} from "../../model/group";
import type {UserObject} from "../../model/user";
import UserContainer from "../../containers/UserContainer";
import FollowedGroups from "../../components/FollowedGroups";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff8',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});

export default ({user, groups, edit, navigation}: { user: UserObject, groups: Array<GroupObject>, edit: () => {}, navigation: {} }) => (
  <View style2={styles.container}>
    <UserContainer user={user} showEdit={true} navigation={navigation}/>
    <TestContainer/>
    <FollowedGroups ids={user.groups} navigation={navigation}/>
  </View>
);
