// @flow

import React from 'react';
import {Button, Text, View} from 'react-native';
import persist from "../persist";
import type {downloadProgressType} from "../reducers/downloadProgress";

const Test = ({isOnline, doIt, downloadProgress}: { isOnline: boolean, doIt: (boolean) => {}, downloadProgress: downloadProgressType }) => {
  const downloadIndicator = downloadProgress.downloadingCount > 0
    ? <Text>{downloadProgress.downloadingCount - downloadProgress.filesLeft.length} / {downloadProgress.downloadingCount}</Text>
    : null;

  return <View style={{flexDirection: 'row', justifyContent: "space-evenly", width: "100%", alignItems: "center"}}>
    {downloadIndicator}
    <Text>{isOnline ? 'online' : 'offline'}</Text>
    <Button onPress={() => doIt(!isOnline)} title="toggle"/>
    <Button onPress={() => persist.clearAll()} title="clear all"/>
  </View>;
};

export default Test;
