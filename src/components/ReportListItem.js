// @flow

import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import HTML from 'react-native-render-html';
import {FontAwesome} from '@expo/vector-icons';
import vars from "../vars";
import {hairlineWidth} from "../util";

export default ({kobo_form, enter}: {
  kobo_form: KoboFromObject,
  enter: () => {},
}) => {

  console.log(kobo_form.description);
  const contents = [
    <View key="info" style={styles.info}>
      <Text numberOfLines={4} ellipsizeMode="tail" style={styles.title}>{kobo_form.title}</Text>
      {kobo_form.description !== undefined && <HTML html={kobo_form.description}/>}
    </View>,
  ];

  return <TouchableOpacity
    style={styles.container}
    onPress={enter}
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
});
