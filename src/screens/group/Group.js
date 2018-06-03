// @flow

import React from 'react';
import TestContainer from '../../containers/TestContainer';
import {Text, View} from 'react-native';
import type {PrivateGroupObject, PublicGroupObject} from "../../model/group";

export default ({online, group}: { online: boolean, group: PublicGroupObject | PrivateGroupObject }) => (
  <View>
    <TestContainer/>
    <Text>online: {online ? 'on' : 'off'}</Text>
    <Text>group id: {group.id}</Text>
    <Text>group: {JSON.stringify(group)}</Text>
  </View>
);
