// @flow

import React from 'react';
import {ImageBackground, Text, TouchableOpacity} from 'react-native';
import type {GroupObject} from "../model/group";
import type {FactsheetObject} from "../model/factsheet";

export default ({group, factsheet, enter}: { group: GroupObject, factsheet?: FactsheetObject, enter: (id: number) => {} }) => (
  <ImageBackground
    source={{uri: factsheet ? factsheet.image : null}}
    style={{
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
