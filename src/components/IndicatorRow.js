// @flow

import React from 'react';
import {Button, Text, TouchableOpacity, View} from 'react-native';
import type {downloadProgressType} from "../reducers/downloadProgress";
import persist from "../persist";
import config from "../config";

const IndicatorRow = ({isOnline, setOnline, downloadProgress}: {
  isOnline: boolean,
  setOnline: (boolean) => {},
  downloadProgress: downloadProgressType,
}) => {
  const downloadIndicator = downloadProgress.downloadingCount > 0
    ? <Text style={{flex: 1}}>
      Downloading {downloadProgress.downloadingCount - downloadProgress.filesLeft.length + 1} / {downloadProgress.downloadingCount}
    </Text>
    : null;

  const onlineIndicator = config.debugOnlineIndicator
    ? <TouchableOpacity
      style={{flex: 1, alignItems: "flex-end"}}
      onPress={() => setOnline(!isOnline)}
      onLongPress={() => persist.clearAll(true)}
    >
      <Text>{isOnline ? 'online' : 'offline'}</Text>
    </TouchableOpacity>
    : <Text style={{flex: 1, textAlign: "right"}}>{isOnline ? 'online' : 'offline'}</Text>;

  return <View style={{
    flexDirection: 'row',
    justifyContent: "space-evenly",
    width: "100%",
    alignItems: "center",
    padding: 10,
  }}>
    {downloadIndicator}
    {onlineIndicator}
  </View>;
};

export default IndicatorRow;
