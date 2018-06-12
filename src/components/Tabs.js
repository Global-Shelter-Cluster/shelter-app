// @flow

import React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import vars from "../vars";

const Tabs = ({tabs, current, changeTab}: {
  tabs: { [string]: string },
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

    if (current === key)
      return <View
        key={key}
        style={tabStyle}
      >
        <Text style={[styles.label, styles.activeLabel]}>{tabs[key]}</Text>
      </View>;
    else
      return <TouchableOpacity
        activeOpacity={1} // no visual feedback
        key={key}
        style={tabStyle}
        onPress={() => changeTab(key)}
      >
        <Text style={styles.label}>{tabs[key]}</Text>
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
  active: {
    backgroundColor: vars.SHELTER_DARK_BLUE,
  },
  label: {
    fontSize: 17,
    textAlign: "center",
  },
  activeLabel: {
    fontWeight: "bold",
    color: "white",
  },
});
