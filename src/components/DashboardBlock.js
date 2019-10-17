// @flow

import React from 'react';
import {FontAwesome} from '@expo/vector-icons';
import vars from "../vars";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {hairlineWidth} from "../util";

export type DashboardBlockType = {
  title: string,
  icon: string,
  icon2?: string,
  badge?: string,
  isBadgeHighlighted?: true,
  action?: () => {},
  disabledIcon?: string,
};

const DashboardBlock = ({title, icon, icon2, badge, isBadgeHighlighted, action, disabledIcon}: DashboardBlockType) => {
  const showAsDisabled = disabledIcon !== undefined || action === undefined;
  const iconStyles = showAsDisabled ? [styles.icon, styles.disabled] : [styles.icon];

  const iconRow = icon2
    ? <View style={{flexDirection: "row"}}>
      <FontAwesome name={icon} size={28} style={iconStyles}/>
      {icon2 ? <FontAwesome name={icon2} size={28} style={iconStyles}/> : null}
    </View>
    : <FontAwesome name={icon} size={28} style={iconStyles}/>;

  if (showAsDisabled)
    return <View style={[styles.container, styles.disabledContainer]}>
      {iconRow}
      <Text style={[styles.label, styles.disabled]}>{title}</Text>
      {disabledIcon !== undefined
        ? <FontAwesome style={styles.iconBadge} name={disabledIcon} size={20} color={vars.ACCENT_RED}/>
        : null
      }
    </View>;
  else
    return <TouchableOpacity
      onPress={action} style={styles.container}>
      {iconRow}
      <Text style={styles.label}>{title}</Text>
      {badge !== undefined && <View style={[styles.badge, isBadgeHighlighted ? styles.highlightedBadge : null]}>
        <Text style={[styles.badgeText, isBadgeHighlighted ? styles.highlightedBadgeText : null]}>{badge}</Text>
      </View>}
    </TouchableOpacity>;
};

export default DashboardBlock;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "30%",
    margin: 5,
    backgroundColor: vars.VERY_LIGHT_GREY,
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 5,
    borderWidth: hairlineWidth,
    minHeight: 92,
  },
  disabledContainer: {
    backgroundColor: "rgba(0,0,0,.02)",
  },
  disabled: {
    opacity: .5,
  },
  icon: {
    marginBottom: 10,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 14,
    textAlign: "center",
  },
  badge: {
    position: "absolute",
    top: 5,
    right: 5,
    borderRadius: 11,
    padding: 4,
    height: 23,
    minWidth: 23,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: vars.SHELTER_GREY,
  },
  highlightedBadge: {
    backgroundColor: vars.SHELTER_RED,
    borderColor: vars.SHELTER_RED,
  },
  badgeText: {
    fontSize: 12,
    color: vars.SHELTER_GREY,
  },
  highlightedBadgeText: {
    color: "white",
  },
  iconBadge: {
    position: "absolute",
    top: 10,
    right: 10,
  }
});
