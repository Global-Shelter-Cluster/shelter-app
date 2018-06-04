// @flow

import React from 'react';
import {ImageBackground, StyleSheet, TouchableOpacity, View} from 'react-native';
import type {GroupObject} from "../model/group";
import type {FactsheetObject} from "../model/factsheet";
import {FontAwesome} from '@expo/vector-icons';
import vars from "../vars";
import SingleLineText from "./SingleLineText";

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
        ? <TouchableOpacity onPress={() => enter(group.id)} style={styles.textOnlyContainer}>
          <SingleLineText style={[styles.textOnlyLabel, {flex: 1}]}>{group.title}</SingleLineText>
          <FontAwesome
            name={"angle-right"} size={18} color={vars.MEDIUM_GREY}
            style={styles.textOnlyIcon}
          />
        </TouchableOpacity>
        : <SingleLineText style={styles.textOnlyLabel}>{group.title}</SingleLineText>;

    case 'full':
    default:
      return link
        ? <ImageBackground
          source={factsheet ? {uri: factsheet.image} : null}
          style={styles.fullContainer}
        >
          <TouchableOpacity
            style={styles.fullInnerContainer}
            activeOpacity={0}
            onPress={() => enter(group.id)}
          >
            <SingleLineText style={styles.fullLabel}>{group.title}</SingleLineText>
          </TouchableOpacity>
        </ImageBackground>
        : <ImageBackground
          source={factsheet ? {uri: factsheet.image} : null}
          style={styles.fullContainer}
        >
          <View style={styles.fullInnerContainer}>
            <SingleLineText style={styles.fullLabel}>{group.title}</SingleLineText>
          </View>
        </ImageBackground>;
  }
}

const styles = StyleSheet.create({
  textOnlyContainer: {
    flexDirection: "row",
  },
  textOnlyLabel: {
    padding: 10,
    paddingTop: 0,
    fontSize: 18,
  },
  textOnlyIcon: {
    paddingRight: 10,
    paddingTop: 2,
  },
  fullContainer: {
    height: 100,
    marginBottom: StyleSheet.hairlineWidth,
  },
  fullInnerContainer: {
    padding: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "flex-end",
    backgroundColor: "rgba(0,0,0,.6)",
  },
  fullLabel: {
    color: "white",
    fontSize: 18,
    margin: 10,
  },
});
