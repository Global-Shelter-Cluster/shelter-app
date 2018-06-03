// @flow

import React from 'react';
import {Button, Text, View} from 'react-native';
import type {PrivateGroupObject} from "../model/group";

export default ({group, enter}: { group: PrivateGroupObject, enter: (id: number) => {} }) => (
  <View
    style={{flexDirection: 'row', justifyContent: "space-between", width: "100%", padding: 10}}>
    <Text>i {group.id}</Text>
    <Text>{group.title} t</Text>
    <Button onPress={() => enter(group.id)} title="go"/>
  </View>
);
