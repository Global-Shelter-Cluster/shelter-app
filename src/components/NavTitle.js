// @flow

import React from 'react';
import {Platform, StyleSheet, Text} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import vars from "../vars";

const NavTitle = ({online, title}: { online: boolean, title: string }) => {
  if (online)
    return <Text style={[styles.title, styles.container]} numberOfLines={1} ellipsizeMode="tail">{title}</Text>;

  return <Text style={styles.container} numberOfLines={1}>
    <FontAwesome name="wifi" size={20} color={vars.ACCENT_RED}/>
    <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{" " + title}</Text>
  </Text>
};

export default NavTitle;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  title: Platform.OS === 'ios'
    ? {
      fontSize: 17,
      color: "rgba(0,0,0,.9)",
      fontWeight: "700",
    }
    : {
      fontSize: 20,
      color: "rgba(0,0,0,.9)",
      fontWeight: "500",
    },
});
