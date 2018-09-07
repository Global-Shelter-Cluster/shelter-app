// @flow

import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import type {ContactObject} from "../model/contact";
import vars from "../vars";

const image = require("../../assets/contact.png");

export default ({contact, enter}: {
  contact: ContactObject,
  enter: () => {},
}) => {
  const preview = contact.picture
    ? <Image key="picture" style={styles.picture} source={{uri: contact.picture}}/>
    : <Image key="picture" style={styles.picture} source={image}/>;

  const subtitle = [];
  if (contact.org !== undefined)
    subtitle.push(contact.org);
  if (contact.role !== undefined)
    subtitle.push(contact.role);

  const contents = [
    preview,
    <View key="info" style={styles.info}>
      <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>{contact.name}</Text>
      {subtitle.length > 0 ? <Text style={styles.secondary}>{subtitle.join(" • ")}</Text> : null}
    </View>,
  ];

  const icons = [];

  if (contact.mail !== undefined)
    icons.push(<FontAwesome
      key="mail" name={"envelope-o"} size={18} color={vars.MEDIUM_GREY}
      style={styles.rightArrow}
    />);

  if (contact.phone !== undefined)
    icons.push(<FontAwesome
      key="phone" name={"phone"} size={18} color={vars.MEDIUM_GREY}
      style={styles.rightArrow}
    />);

  if (contact.bio !== undefined)
    icons.push(<FontAwesome
      key="bio" name={"align-left"} size={18} color={vars.MEDIUM_GREY}
      style={styles.rightArrow}
    />);

  return enter !== undefined
    ? <TouchableOpacity
      style={styles.container}
      onPress={enter}
    >
      {contents}
      {icons}
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
  picture: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: "cover",
    borderWidth: 1,
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
