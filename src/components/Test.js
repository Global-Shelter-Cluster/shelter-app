// @flow

import React from 'react';
import {Button, Text, View} from 'react-native';

const Test = ({isOnline, doIt}) => (
  <View>
    <Text>{isOnline ? 'online' : 'offline'}</Text>
    <Button onPress={() => doIt(!isOnline)} title="toggle"/>
  </View>
);

export default Test;
