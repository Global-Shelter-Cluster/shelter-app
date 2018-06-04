// @flow

import React from 'react';
import {Image, Text, View} from 'react-native';
import Button from './Button.js';
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
      {showEdit && <Button primary onPress={edit} title="Edit" icon="pencil"/>}
    </View>
    <Image style={{width: 100, height: 100, borderRadius: 50, marginLeft: 10}} source={{uri: user.picture}}/>
  </View>
);
