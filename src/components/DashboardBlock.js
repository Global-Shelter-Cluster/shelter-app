// @flow

import React from 'react';
import {FontAwesome} from '@expo/vector-icons';
import vars from "../vars";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";

const DashboardBlock = ({title, icon, badge, action}: {
  title: string,
  icon: string,
  badge?: string,
  action: () => {},
}) => (
  <TouchableOpacity
    onPress={action} style={styles.container}>
    <FontAwesome name={icon} size={40} style={styles.icon}/>
    <Text style={styles.label}>{title}</Text>
    {badge !== undefined && <View style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View>}
  </TouchableOpacity>
);

export default DashboardBlock;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "40%",
    margin: 10,
    backgroundColor: "rgba(0,0,0,.05)",
    padding: 10,
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
  },
  icon: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    textAlign: "center",
  },
  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 11,
    backgroundColor: vars.SHELTER_RED,
    padding: 4,
    height: 22,
    minWidth: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    fontSize: 12,
    color: "white",
  },
});
