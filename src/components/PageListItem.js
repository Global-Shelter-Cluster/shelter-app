// @flow

import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import vars from "../vars";
import {hairlineWidth} from "../util";
import type {PageObject} from "../model/page";

export default ({page, enter, indent}: {
  page: PageObject,
  enter: () => {} | null,
  indent?: true,
}) => {
  const contents = [
    <View key="info" style={styles.info}>
      <Text numberOfLines={2} ellipsizeMode="tail"
            style={[styles.title, indent ? styles.indent : null]}>{page.title}</Text>
    </View>,
  ];

  if (enter) {
    return <TouchableOpacity
      style={styles.container}
      onPress={enter}
    >
      {contents}
      <FontAwesome
        name={"angle-right"} size={18} color={vars.MEDIUM_GREY}
        style={styles.rightArrow}
      />
    </TouchableOpacity>;
  } else {
    return <View style={styles.container}>{contents}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
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
  indent: {
    paddingLeft: 30,
  },
});
