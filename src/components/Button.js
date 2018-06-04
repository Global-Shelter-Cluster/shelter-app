// @flow

import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import vars from "../vars";

export default ({onPress, primary, title, icon}: {
  onPress: () => {},
  primary: boolean,
  title: string,
  icon?: string,
}) => {
  const bgColor = primary ? vars.SHELTER_RED : vars.SHELTER_GREY;
  const textColor = "white";

  return <TouchableOpacity onPress={onPress} style={{
    flexDirection: "row",
    backgroundColor: bgColor,
    borderRadius: 2,
    marginTop: 20,
    marginBottom: 20,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 20,
    paddingRight: 20,
  }}>
    {icon && <FontAwesome
      name={icon} size={18} color={textColor}
      style={{paddingRight: 10, paddingTop: 2}}
    />}
    <Text
      numberOfLines={1}
      ellipsizeMode="tail"
      style={{
        color: textColor,
        flex: 1,
        fontSize: 18,
        textAlign: "center",
      }}
    >
      {title}
    </Text>
  </TouchableOpacity>;
}
