// @flow

import React from "react";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import {FontAwesome} from '@expo/vector-icons';
import vars from "../vars";
import SingleLineText from "./SingleLineText";

export type tabsDefinition = {
  [tab: string]: {
    label: string,
    disabledIcon?: string,
  },
};

const Tabs = ({tabs, current, changeTab}: {
  tabs: tabsDefinition,
  current: string,
  changeTab: (tab: string) => {},
}) => {
  const renderTab = (key, i) => {
    const tabStyle = [styles.tab];
    if (current === key)
      tabStyle.push(styles.active);
    if (i === 0)
      tabStyle.push(styles.tabFirst);
    if (i === Object.keys(tabs).length - 1)
      tabStyle.push(styles.tabLast);
    if (tabs[key].disabledIcon)
      tabStyle.push(styles.disabledTab);

    if (current === key)
      return <View
        key={key}
        style={tabStyle}
      >
        <SingleLineText style={[styles.label, styles.activeLabel]}>{tabs[key].label}</SingleLineText>
      </View>;
    else if (tabs[key].disabledIcon)
      return <View
        key={key}
        style={tabStyle}
      >
        <FontAwesome style={styles.iconBadge} name={tabs[key].disabledIcon} size={20} color={vars.ACCENT_RED}/>
        <SingleLineText
          style={[styles.label, styles.disabledLabel]}>{" " + tabs[key].label}</SingleLineText>
      </View>;
    else
      return <TouchableOpacity
        activeOpacity={1} // no visual feedback
        key={key}
        style={tabStyle}
        onPress={() => changeTab(key)}
      >
        <SingleLineText style={styles.label}>{tabs[key].label}</SingleLineText>
      </TouchableOpacity>;
  };

  return <View style={styles.container}>
    {Object.keys(tabs).map(renderTab)}
  </View>;
};

export default Tabs;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  tab: {
    flexDirection: "row",
    justifyContent: "center",
    flex: 1,
    backgroundColor: vars.SHELTER_LIGHT_BLUE,
    padding: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: vars.SHELTER_GREY,
  },
  tabFirst: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  tabLast: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  disabledTab: {
    backgroundColor: "rgba(0,0,0,.05)",
  },
  disabledLabel: {
    opacity: .5,
  },
  active: {
    backgroundColor: vars.SHELTER_DARK_BLUE,
  },
  label: {
    fontSize: 16,
  },
  activeLabel: {
    fontWeight: "bold",
    color: "white",
  },
});
