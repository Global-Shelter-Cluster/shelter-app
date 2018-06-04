// @flow

import React from 'react';
import {ImageBackground, Text, TouchableOpacity, View} from 'react-native';
import type {GroupObject} from "../model/group";
import type {FactsheetObject} from "../model/factsheet";
import {FontAwesome} from '@expo/vector-icons';
import vars from "../vars";

export default ({group, link, display, factsheet, enter}: {
  group: GroupObject,
  link: boolean,
  display: "full" | "text-only",
  factsheet?: FactsheetObject,
  enter: (id: number) => {},
}) => {
  switch (display) {
    case 'text-only':
      return link
        ? <TouchableOpacity onPress={() => enter(group.id)} style={{flexDirection: "row"}}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              flex: 1,
              padding: 10,
              paddingTop: 0,
              fontSize: 18,
            }}
          >{group.title}</Text>
          <FontAwesome
            name={"angle-right"} size={18} color={vars.MEDIUM_GREY}
            style={{paddingRight: 10, paddingTop: 2}}
          />
        </TouchableOpacity>
        : <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            padding: 10,
            paddingTop: 0,
            fontSize: 18,
          }}
        >{group.title}</Text>;

    case 'full':
    default:
      return link
        ? <ImageBackground
          source={factsheet ? {uri: factsheet.image} : null}
          style={{
            height: 100,
            marginBottom: .5,
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
        : <ImageBackground
          source={factsheet ? {uri: factsheet.image} : null}
          style={{
            height: 100,
            marginBottom: 10,
          }}
        >
          <View
            style={{
              padding: 10,
              flex: 1,
              flexDirection: 'row',
              justifyContent: "space-between",
              alignItems: "flex-end",
              backgroundColor: "rgba(0,0,0,.6)",
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 18,
                margin: 10,
              }}
            >{group.title}</Text>
          </View>
        </ImageBackground>;
  }
}
