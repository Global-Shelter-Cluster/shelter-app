// @flow

import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import type {NewsObject} from "../model/news";
import vars from "../vars";
import {hairlineWidth, timeAgo} from "../util";

export default ({news, isSeen, markSeen, enter}: {
  news: NewsObject,
  isSeen: boolean,
  markSeen: () => {},
  enter: () => {},
}) => {
  const contents = [
    <View key="info" style={styles.info}>
      <Text numberOfLines={4} ellipsizeMode="tail"
            style={[styles.title, isSeen ? null : styles.unseen]}>{news.title}</Text>
      <Text style={styles.secondary}>{timeAgo(news.date)}</Text>
    </View>,
  ];

  return <TouchableOpacity
    style={[styles.container, isSeen ? null : styles.containerUnseen]}
    onPress={() => {
      markSeen();
      enter();
    }}
  >
    {contents}
    <FontAwesome
      name={"angle-right"} size={18} color={vars.MEDIUM_GREY}
      style={styles.rightArrow}
    />
  </TouchableOpacity>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    borderColor: vars.SHELTER_GREY,
    borderTopWidth: hairlineWidth,
    borderBottomWidth: hairlineWidth,
    marginBottom: 5,
    backgroundColor: 'rgba(255,177,0,.1)',
  },
  containerUnseen: {
    backgroundColor: 'rgba(255,177,0,.2)',
  },
  info: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 4,
  },
  unseen: {
    fontWeight: "bold",
  },
  secondary: {
    color: vars.SHELTER_GREY,
  },
  rightArrow: {
    paddingLeft: 10,
    paddingTop: 2,
  },
});
