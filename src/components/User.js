// @flow

import React from 'react';
import {Image, Text, View} from 'react-native';
import type {UserObject} from "../model/user";
import vars from "../vars";

export default ({user, showEdit}: { user: UserObject, showEdit: boolean }) => (
  <View
    style={{flexDirection: 'row', justifyContent: "space-between", width: "100%", alignItems2: "center", padding: 10}}>
    <Text style={{fontSize: 30, fontWeight: "bold", color: vars.SHELTER_RED}}>{user.name}</Text>
    <Image style={{width: 100, height: 100, borderRadius: 50}} source={{uri: user.picture}}/>
  </View>
);

