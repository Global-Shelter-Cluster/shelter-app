// @flow

import React from 'react';
import TestContainer from '../../containers/TestContainer';
import {StyleSheet, Text, View, WebView} from 'react-native';
import type {GroupObject} from "../../model/group";
import type {UserObject} from "../../model/user";
import User from "../../components/User";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff8',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});

export default ({user, groups, online}: {user: UserObject, groups: Array<GroupObject>, online: boolean}) => (
  <View style={styles.container}>
    <User user={user} showEdit={online}/>
    <Text>{user.name}</Text>
    <Text>groups: {JSON.stringify(groups)}</Text>
    <TestContainer/>
    <WebView
      source={{uri: 'https://ee.humanitarianresponse.info/x/#XfkA2YFa'}}
      style={{marginTop: 20, backgroundColor: '#dff', height: 100, width: 400}}
    />
  </View>
);
