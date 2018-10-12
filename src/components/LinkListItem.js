// @flow

import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import vars from "../vars";
import SingleLineText from "./SingleLineText";

export default ({url, title, online, enter}: {
  url: string,
  title?: string,
  online: boolean,
  enter: () => {},
}) => {
  const titleElement = title
    ? <View style={styles.textOnlyContainer}>
      <Text style={styles.textOnlyLabel}>{title}</Text>
    </View>
    : <View style={styles.textOnlyContainer}>
      <SingleLineText style={styles.textOnlyLabel}>{url}</SingleLineText>
    </View>;

  return online
    ? <TouchableOpacity onPress={enter} style={styles.textOnlyContainer}>
      {titleElement}
      <FontAwesome
        name={"angle-right"} size={18} color={vars.MEDIUM_GREY}
        style={styles.textOnlyIcon}
      />
    </TouchableOpacity>
    : titleElement;
}

const styles = StyleSheet.create({
  textOnlyContainer: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 3,
    alignItems: "center",
  },
  textOnlyLabel: {
    padding: 10,
    paddingTop: 0,
    paddingLeft: 20,
    fontSize: 18,
  },
  textOnlyIcon: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
});
