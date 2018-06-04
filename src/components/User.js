// @flow

import React from 'react';
import {Button, Image, Text, View} from 'react-native';
import type {PrivateUserObject, PublicUserObject} from "../model/user";
import vars from "../vars";

export default ({user, showEdit, edit}: { user: PrivateUserObject | PublicUserObject, showEdit: boolean, edit: () => {} }) => (
  <View
    style={{flexDirection: 'row', justifyContent: "space-between", width: "100%", padding: 10}}>
    <View style={{flexShrink: 1}}>
      <Text style={{fontSize: 30, fontWeight: "bold", color: vars.SHELTER_RED, marginBottom: 10}}>{user.name}</Text>
      {(user.org || user.role) &&
      <Text style={{fontSize: 14, color: vars.MEDIUM_GREY}}>
        <Text style={{fontWeight: "bold"}}>{user.org}</Text>
        {user.org && user.role && <Text style={{}}> • </Text>}
        <Text style={{fontStyle: "italic"}}>{user.role}</Text>
      </Text>}
      {showEdit && <Button color={vars.SHELTER_RED} onPress={edit} title="Edit"/>}
    </View>
    <Image style={{width: 120, height: 120, borderRadius: 60}} source={{uri: user.picture}}/>
  </View>
);
