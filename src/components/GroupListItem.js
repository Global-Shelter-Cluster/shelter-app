// @flow

import React from 'react';
import {Button, Text, View} from 'react-native';
import type {GroupObject} from "../model/group";

export default ({group, enter}: { group: GroupObject, enter: (id: number) => {} }) => (
  <View
    style={{flexDirection: 'row', justifyContent: "space-between", width: "100%", padding: 10}}>
    <Text>i {group.id}</Text>
    <Text>{group.title} t</Text>
    <Button onPress={() => {console.log('CC entering ' + group.id); enter(group.id)}} title="go"/>
  </View>
);
