// @flow

import React from 'react';
import {ImageBackground, Text, TouchableOpacity} from 'react-native';
import type {ExpandedGroupObject} from "../model/group";

export default ({group, enter}: { group: ExpandedGroupObject, enter: (id: number) => {} }) => (
  <ImageBackground
    source={{uri: group.latest_factsheet.image}}
    style={{
      // width: "100%",
      height: 100,
      marginBottom: 10,
    }}
  >
    <TouchableOpacity
      style={{
        padding: 10,
        flex: 1,
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "flex-end",
        backgroundColor: "rgba(0,0,0,.6)",
      }}
      activeOpacity={0}
      onPress={() => enter(group.id)}
    >
      <Text
        style={{
          color: "white",
          fontSize: 18,
          margin: 10,
        }}
      >{group.title}</Text>
    </TouchableOpacity>
  </ImageBackground>
);
