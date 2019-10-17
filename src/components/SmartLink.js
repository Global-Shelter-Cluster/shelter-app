// @flow

import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import vars from "../vars";
import {hairlineWidth} from "../util";

export default ({title, enter, linkType}: {
  title: string,
  enter?: () => {},
  linkType: 'document' | 'event' | 'factsheet' | 'kobo_form' | 'webform' | 'group' | 'url',
}) => {
  const contents = [
    <View key="info" style={styles.info}>
      <Text numberOfLines={4} ellipsizeMode="tail"
            style={[styles.title]}>{title}</Text>
    </View>,
  ];

  const icons = {
    'document': "file-o",
    'event': "calendar",
    'factsheet': "bar-chart",
    'kobo_form': "pencil-square-o",
    'webform': "pencil-square-o",
    'group': "users",
    'url': "globe",
  };

  const linkTypeIcon = icons[linkType] !== undefined
    ? <FontAwesome
      name={icons[linkType]} size={18} color={vars.MEDIUM_GREY}
      style={styles.rightArrow}
    />
    : null;

  const isClickable = enter !== undefined;

  return isClickable
    ? <TouchableOpacity
      style={[styles.container]}
      onPress={enter}
    >
      {contents}
      {linkTypeIcon}
      <FontAwesome
        name={"angle-right"} size={18} color={vars.MEDIUM_GREY}
        style={styles.rightArrow}
      />
    </TouchableOpacity>
    : <View style={styles.container}>
      {contents}
      {linkTypeIcon}
    </View>
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 10,
    marginLeft: 10,
    borderColor: vars.SHELTER_GREY,
  },
  info: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 4,
  },
  rightArrow: {
    paddingLeft: 10,
    paddingTop: 2,
  },
});
