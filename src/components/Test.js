// @flow

import React from 'react';
import {Button, Text, View} from 'react-native';
import persist from "../persist";

const Test = ({isOnline, doIt}) => (
  <View>
    <Text>{isOnline ? 'online' : 'offline'}</Text>
    <Button onPress={() => doIt(!isOnline)} title="toggle"/>
    <Button onPress={() => persist.clearAll()} title="clear all asyncstorage"/>
  </View>
);

export default Test;
