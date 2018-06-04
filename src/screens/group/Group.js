// @flow

import React from 'react';
import TestContainer from '../../containers/TestContainer';
import {Text, View} from 'react-native';
import type {PublicGroupObject} from "../../model/group";
import GroupContextualNavigation from "../../components/GroupContextualNavigation";

export default ({online, group}: { online: boolean, group: PublicGroupObject }) => (
  <View style={{flex: 1}}>
    <GroupContextualNavigation group={group}/>
    <Text>online: {online ? 'on' : 'off'}</Text>
    <Text>group id: {group.id}</Text>
    <Text>group: {JSON.stringify(group)}</Text>
    <TestContainer/>
  </View>
);
