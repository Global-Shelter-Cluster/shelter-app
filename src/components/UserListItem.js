// @flow

import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import type {UserObject} from "../model/user";
import vars from "../vars";

const image = require("../../assets/contact.png");

export default ({user, enter}: {
  user: UserObject,
  enter: () => {},
}) => {
  const preview = user.picture
    ? <Image key="picture" style={styles.picture} source={{uri: user.picture}}/>
    : <Image key="picture" style={styles.picture} source={image}/>;

  const subtitle = [];
  if (user.org !== undefined)
    subtitle.push(user.org);
  if (user.role !== undefined)
    subtitle.push(user.role);

  const contents = [
    preview,
    <View key="info" style={styles.info}>
      <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>{user.name}</Text>
      {subtitle.length > 0 ? <Text style={styles.secondary}>{subtitle.join(" • ")}</Text> : null}
    </View>,
  ];

  const icons = [];

  if (user.mail !== undefined)
    icons.push(<FontAwesome
      key="mail" name={"envelope-o"} size={18} color={vars.MEDIUM_GREY}
      style={styles.rightArrow}
    />);

  // if (user.phone !== undefined)
  //   icons.push(<FontAwesome
  //     key="phone" name={"phone"} size={18} color={vars.MEDIUM_GREY}
  //     style={styles.rightArrow}
  //   />);
  //
  // if (user.bio !== undefined)
  //   icons.push(<FontAwesome
  //     key="bio" name={"align-left"} size={18} color={vars.MEDIUM_GREY}
  //     style={styles.rightArrow}
  //   />);

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
