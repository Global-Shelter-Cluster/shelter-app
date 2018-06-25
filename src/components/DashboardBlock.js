// @flow

import React from 'react';
import {FontAwesome} from '@expo/vector-icons';
import vars from "../vars";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";

export type DashboardBlockType = {
  title: string,
  icon: string,
  badge?: string,
  action?: () => {},
  disabledIcon?: string,
};

const DashboardBlock = ({title, icon, badge, action, disabledIcon}: DashboardBlockType) => {
  if (disabledIcon !== undefined)
    return <View style={[styles.container, styles.disabledContainer]}>
      <FontAwesome name={icon} size={40} style={[styles.icon, styles.disabled]}/>
      <Text style={[styles.label, styles.disabled]}>{title}</Text>
      <FontAwesome style={styles.iconBadge} name={disabledIcon} size={20} color={vars.ACCENT_RED}/>
    </View>;
  else
    return <TouchableOpacity
      onPress={action} style={styles.container}>
      <FontAwesome name={icon} size={40} style={styles.icon}/>
      <Text style={styles.label}>{title}</Text>
      {badge !== undefined && <View style={styles.badge}>
        <Text style={styles.badgeText}>{badge}</Text>
      </View>}
    </TouchableOpacity>;
};

export default DashboardBlock;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "40%",
    margin: 10,
    backgroundColor: vars.VERY_LIGHT_GREY,
    padding: 10,
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
  },
  disabledContainer: {
    backgroundColor: "rgba(0,0,0,.02)",
  },
  disabled: {
    opacity: .5,
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
  iconBadge: {
    position: "absolute",
    top: 10,
    right: 10,
  }
});
