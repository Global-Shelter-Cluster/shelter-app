// @flow

import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import vars from "../vars";
import SingleLineText from "./SingleLineText";

export default ({onPress, primary, title, icon}: {
  onPress: () => {},
  primary: boolean,
  title: string,
  icon?: string,
}) => {
  const bgColor = primary ? vars.SHELTER_RED : vars.SHELTER_GREY;
  const textColor = "white";

  return <TouchableOpacity onPress={onPress} style={[styles.container, {backgroundColor: bgColor}]}>
    {icon && <FontAwesome name={icon} size={18} color={textColor} style={styles.icon}/>}
    <SingleLineText style={[styles.label, {color: textColor}]}>{title}</SingleLineText>
  </TouchableOpacity>;
}


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 2,
    marginTop: 20,
    marginBottom: 20,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    paddingRight: 8,
  },
  label: {
    fontSize: 18,
    textAlign: "center",
  },
});
