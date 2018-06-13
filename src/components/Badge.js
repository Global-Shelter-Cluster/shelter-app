// @flow

import React from 'react';
import {Text, View} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';

const Badge = ({icon, value, color}: { icon: string, value: number, color: string }) =>
  <View style={{flexDirection: "row", marginLeft: 20}}>
    <FontAwesome name={icon} size={18} color={color}/>
    <Text style={{color: color}}> {value}</Text>
  </View>;

export default Badge;
