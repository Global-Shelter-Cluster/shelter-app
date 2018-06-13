// @flow

import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import type {EventObject} from "../model/event";
import vars from "../vars";
import moment from "moment/moment";

export default ({event, link, enter}: {
  event: EventObject,
  link: boolean,
  enter: (id: number) => {},
}) => {
  const map = event.map
    ? <Image key="map" style={styles.map} source={{uri: event.map}}/>
    : <View key="map" style={styles.mapBlank}/>;

  const contents = [
    <View key="info" style={styles.info}>
      <Text numberOfLines={4} ellipsizeMode="tail" style={styles.title}>{event.title}</Text>
      <Text style={styles.secondary}>{moment(event.date).format('D MMM YYYY')}</Text>
    </View>,
    map,
  ];

  return link
    ? <TouchableOpacity
      style={styles.container}
      onPress={() => enter(event.id)}
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
  map: {
    width: 120,
    height: 120,
    resizeMode: "cover",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: vars.SHELTER_GREY,
  },
  mapBlank: {
    width: 120,
    height: 120,
    borderWidth: StyleSheet.hairlineWidth,
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
  secondary: {
    color: vars.SHELTER_GREY,
  },
  rightArrow: {
    paddingLeft: 10,
    paddingTop: 2,
  },
});
