// @flow

import React from 'react';
import {Button, Text, View} from 'react-native';
import persist from "../persist";

const Test = ({isOnline, doIt}) => (
  <View style={{flexDirection: 'row', justifyContent: "space-evenly", width: "100%", alignItems: "center"}}>
    <Text>{isOnline ? 'online' : 'offline'}</Text>
    <Button onPress={() => doIt(!isOnline)} title="toggle"/>
    <Button onPress={() => persist.clearAll()} title="clear all"/>
  </View>
);

export default Test;
