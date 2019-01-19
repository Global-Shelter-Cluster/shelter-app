// @flow

import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import HTML from 'react-native-render-html';
import {FontAwesome} from '@expo/vector-icons';
import vars from "../vars";
import {hairlineWidth} from "../util";
import type {WebformObject} from "../model/webform";
import SingleLineText from "./SingleLineText";
import type {GroupObject} from "../model/group";
import Badge from "./Badge";

export default ({webform, enter, showGroup, group, badge}: {
  webform: WebformObject,
  enter: () => {},
  showGroup?: true,
  group?: GroupObject,
  badge?: number,
}) => {

  const contents = [
    <View key="info" style={styles.info}>
      <Text numberOfLines={4} ellipsizeMode="tail" style={styles.title}>{webform.title}</Text>
      {showGroup && group
        ? <SingleLineText style={styles.secondary}>{group.title}</SingleLineText>
        : null
      }
      {webform.description !== undefined && <HTML html={webform.description}/>}
    </View>,
  ];

  return <TouchableOpacity
    style={styles.container}
    onPress={enter}
  >
    {contents}
    {badge !== undefined && badge > 0
      ? <View style={styles.badge}>
        <Text style={styles.badgeText}>{badge}</Text>
      </View>
      : null
    }
    <FontAwesome
      name={"angle-right"} size={18} color={vars.MEDIUM_GREY}
      style={styles.rightArrow}
    />
  </TouchableOpacity>
}

const styles = StyleSheet.create({
  container: {
    borderColor: vars.LIGHT_GREY,
    borderTopWidth: hairlineWidth,
    flexDirection: "row",
    padding: 10,
  },
  info: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 4,
  },
  secondary: {
    color: vars.SHELTER_GREY,
  },
  rightArrow: {
    paddingLeft: 10,
    paddingTop: 2,
  },
  badge: {
    borderRadius: 11,
    padding: 4,
    height: 23,
    minWidth: 23,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    backgroundColor: vars.SHELTER_RED,
    borderColor: vars.SHELTER_RED,
  },
  badgeText: {
    fontSize: 12,
    color: "white",
  },
});
