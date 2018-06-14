// @flow

import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import vars from "../vars";
import SingleLineText from "./SingleLineText";

export default ({onPress, primary, title, icon, disabledIcon}: {
  onPress?: () => {},
  primary: boolean,
  title: string,
  icon?: string,
  disabledIcon?: string,
}) => {
  if (disabledIcon !== undefined)
    return <View style={styles.container}>
      <FontAwesome name={disabledIcon} size={18} color={vars.ACCENT_RED} style={styles.icon}/>
      <SingleLineText style={styles.label}>{title}</SingleLineText>
    </View>;

  const bgColor = primary ? vars.SHELTER_RED : vars.SHELTER_GREY;
  const textColor = "white";

  return <TouchableOpacity onPress={onPress} style={[styles.container, {backgroundColor: bgColor}]}>
    {icon && <FontAwesome name={icon} size={18} color={textColor} style={styles.icon}/>}
    <SingleLineText style={[styles.label, {color: textColor}]}>{title}</SingleLineText>
  </TouchableOpacity>;
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 44,
    flexDirection: "row",
    borderRadius: 2,
    marginTop: 20,
    marginBottom: 0,
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,.1)",
  },
  icon: {
    paddingRight: 8,
  },
  label: {
    fontSize: 18,
    textAlign: "center",
  },
});
