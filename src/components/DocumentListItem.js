// @flow

import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import type {DocumentObject} from "../model/document";
import vars from "../vars";
import {timeAgo} from "../util";

export default ({document, link, enter}: {
  document: DocumentObject,
  link: boolean,
  enter: (id: number) => {},
}) => {
  const preview = document.preview
    ? <Image key="preview" style={styles.preview} source={{uri: document.preview}}/>
    : <View key="preview" style={styles.previewBlank}/>;

  const contents = [
    preview,
    <View key="info" style={styles.info}>
      <Text numberOfLines={4} ellipsizeMode="tail" style={styles.title}>{document.title}</Text>
      <Text style={styles.secondary}>{timeAgo(document.date)}</Text>
    </View>,
  ];

  return link
    ? <TouchableOpacity
      style={styles.container}
      onPress={() => enter(document.id)}
    >
      {contents}
      <FontAwesome
        name={"angle-right"} size={18} color={vars.MEDIUM_GREY}
        style={styles.rightArrow}
      />
    </TouchableOpacity>
    : <View style={styles.container}>
      {contents}
    </View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    paddingTop: 0,
  },
  preview: {
    width: 120,
    height: 120,
    resizeMode: "cover",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: vars.SHELTER_GREY,
  },
  previewBlank: {
    width: 120,
    height: 120,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: vars.SHELTER_GREY,
  },
  info: {
    flex: 1,
    marginLeft: 10,
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
