// @flow

import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import type {KoboFormObject} from "../model/kobo_form";
import vars from "../vars";
import moment from "moment/moment";

export default ({kobo_form, enter}: {
  kobo_form: KoboFromObject,
  enter: (id: number) => {},
}) => {

  const contents = [
    <View key="info" style={styles.info}>
      <Text numberOfLines={4} ellipsizeMode="tail" style={styles.title}>{kobo_form.title}</Text>
      <Text numberOfLines={4} ellipsizeMode="tail" style={styles.secondary}>{kobo_form.description}</Text>
    </View>,
  ];

  return <TouchableOpacity
      style={styles.container}
      onPress={() => enter(kobo_form.id)}
    >
      {contents}
      <FontAwesome
        name={"angle-right"} size={18} color={vars.MEDIUM_GREY}
        style={styles.rightArrow}
      />
    </TouchableOpacity>
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: vars.VERY_LIGHT_GREY,
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    margin: 5,
    padding: 10,
    paddingTop: 0,
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
});
