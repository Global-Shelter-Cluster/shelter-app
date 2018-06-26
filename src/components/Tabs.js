// @flow

import React from "react";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import {FontAwesome} from '@expo/vector-icons';
import vars from "../vars";
import SingleLineText from "./SingleLineText";
import {hairlineWidth} from "../util";

export type tabsDefinition = {
  [tab: string]: {
    label: string,
    icon?: string,
    disabledIcon?: string,
  },
};

const Tabs = ({tabs, current, changeTab, labelOnlyOnActive, startsVisualGroup}: {
  tabs: tabsDefinition,
  current: string,
  changeTab: (tab: string) => {},
  labelOnlyOnActive?: true,
  startsVisualGroup?: true, // border radius is 0 on the bottom side, and there's no bottom margin
}) => {
  if (tabs[current] === undefined && Object.keys(tabs).length > 0)
    setTimeout(() => changeTab(Object.keys(tabs)[0]), 0);

  const renderTab = (key, i) => {
    const tabStyle = [styles.tab];
    if (!labelOnlyOnActive)
      tabStyle.push(styles.equalWidth);
    if (current === key)
      tabStyle.push(styles.active);
    if (i === 0) {
      tabStyle.push(styles.tabFirst);
      if (startsVisualGroup)
        tabStyle.push(styles.startsVisualGroupTabFirst);
    }
    if (i === Object.keys(tabs).length - 1) {
      tabStyle.push(styles.tabLast);
      if (startsVisualGroup)
        tabStyle.push(styles.startsVisualGroupTabLast);
    }
    if (tabs[key].disabledIcon)
      tabStyle.push(styles.disabledTab);

    if (current === key)
      return <View
        key={key}
        style={tabStyle}
      >
        {tabs[key].icon !== undefined &&
        <FontAwesome style={styles.icon} name={tabs[key].icon} size={20} color="white"/>}
        <SingleLineText style={[styles.label, styles.activeLabel]}>{tabs[key].label}</SingleLineText>
      </View>;
    else if (tabs[key].disabledIcon)
      return <View
        key={key}
        style={tabStyle}
      >
        <FontAwesome style={styles.icon} name={tabs[key].disabledIcon} size={20} color={vars.ACCENT_RED}/>
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
        {tabs[key].icon !== undefined &&
        <FontAwesome style={styles.icon} name={tabs[key].icon} size={20}/>}
        {(labelOnlyOnActive === undefined || tabs[key].icon === undefined)
        && <SingleLineText style={styles.label}>{tabs[key].label}</SingleLineText>}
      </TouchableOpacity>;
  };

  return <View style={[styles.container, startsVisualGroup ? styles.startsVisualGroupContainer : null]}>
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
  equalWidth: {
    flex: 1,
  },
  tab: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: vars.SHELTER_LIGHT_BLUE,
    padding: 8,
    borderTopWidth: hairlineWidth,
    borderBottomWidth: hairlineWidth,
    borderColor: vars.SHELTER_GREY,
  },
  tabFirst: {
    borderLeftWidth: hairlineWidth,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  tabLast: {
    borderRightWidth: hairlineWidth,
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
    flex: 1,
    backgroundColor: vars.SHELTER_DARK_BLUE,
  },
  label: {
    fontSize: 16,
  },
  activeLabel: {
    fontWeight: "bold",
    color: "white",
  },
  icon: {
    marginRight: 5,
  },
  startsVisualGroupContainer: {
    marginBottom: 0,
  },
  startsVisualGroupTabFirst: {
    borderBottomLeftRadius: 0,
  },
  startsVisualGroupTabLast: {
    borderBottomRightRadius: 0,
  },
});
