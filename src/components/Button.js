// @flow

import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import vars from "../vars";
import SingleLineText from "./SingleLineText";

const Button = ({onPress, primary, dimmed, title, icon, disabledIcon, style, disabled, small}: {
  onPress?: () => void,
  primary?: boolean,
  dimmed?: boolean, // Ignored if "primary" is present.
  title: string,
  icon?: string,
  disabledIcon?: string,
  style?: {},
  disabled?: boolean,
  small?: boolean,
}) => {
  const iconSize = small ? 16 : 18;

  if (disabledIcon !== undefined)
    return <View style={[styles.container, style, small ? styles.smallContainer : null]}>
      <FontAwesome name={disabledIcon} size={iconSize} color={vars.ACCENT_RED} style={styles.icon}/>
      <SingleLineText style={[styles.label, small ? styles.smallLabel : null]}>{title}</SingleLineText>
    </View>;

  const bgColor = primary
    ? vars.SHELTER_RED
    : (dimmed
        ? "transparent"
        : vars.SHELTER_GREY
    );
  const textColor = !primary && dimmed ? vars.SHELTER_GREY : "white";

  return <TouchableOpacity disabled={disabled} onPress={onPress} style={[styles.container, {backgroundColor: bgColor}, style, small ? styles.smallContainer : null]}>
    {icon && <FontAwesome name={icon} size={iconSize} color={textColor} style={styles.icon}/>}
    <SingleLineText style={[styles.label, small ? styles.smallLabel : null, {color: textColor}]}>{title}</SingleLineText>
  </TouchableOpacity>;
};

export default Button;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 44,
    flexDirection: "row",
    borderRadius: 2,
    marginTop: 20,
    marginBottom: 0,
    paddingVertical: 8,
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
  smallContainer: {paddingHorizontal: 10, paddingVertical: 6},
  smallLabel: {fontSize: 15},
});
