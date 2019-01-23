// @flow

import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import vars from "../vars";

const MultiLineButton = ({onPress, primary, dimmed, title, icon, disabledIcon, style}: {
  onPress?: () => void,
  primary?: boolean,
  dimmed?: boolean, // Ignored if "primary" is present.
  title: string,
  icon?: string,
  disabledIcon?: string,
  style?: {},
}) => {
  if (disabledIcon !== undefined)
    return <View style={[styles.container, style]}>
      <FontAwesome name={disabledIcon} size={18} color={vars.ACCENT_RED} style={styles.icon}/>
      <Text style={styles.label}>{title}</Text>
    </View>;

  const bgColor = primary
    ? vars.SHELTER_RED
    : (dimmed
        ? "transparent"
        : vars.SHELTER_GREY
    );
  const textColor = !primary && dimmed ? vars.SHELTER_GREY : "white";

  return <TouchableOpacity onPress={onPress} style={[styles.container, {backgroundColor: bgColor}, style]}>
    {icon && <FontAwesome name={icon} size={18} color={textColor} style={styles.icon}/>}
    <Text style={[styles.label, {color: textColor}]}>{title}</Text>
  </TouchableOpacity>;
};

export default MultiLineButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 2,
    marginTop: 20,
    marginBottom: 0,
    marginHorizontal: 10,
    paddingVertical: 15,
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
