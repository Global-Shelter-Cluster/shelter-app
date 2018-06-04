// @flow

import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import Button from './Button.js';
import type {PrivateUserObject, PublicUserObject} from "../model/user";
import vars from "../vars";

export default ({user, showEdit, edit}: { user: PrivateUserObject | PublicUserObject, showEdit: boolean, edit: () => {} }) => (
  <View
    style={styles.container}>
    <View style={{flexShrink: 1}}>
      <Text style={styles.name}>{user.name}</Text>
      {(user.org || user.role) &&
      <Text style={styles.org_role}>
        <Text style={{fontWeight: "bold"}}>{user.org}</Text>
        {user.org && user.role && <Text> • </Text>}
        <Text style={{fontStyle: "italic"}}>{user.role}</Text>
      </Text>}
      {showEdit && <Button primary onPress={edit} title="Edit" icon="pencil"/>}
    </View>
    <Image style={styles.photo} source={{uri: user.picture}}/>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: "space-between",
    width: "100%",
    padding: 10,
  },
  name: {
    fontSize: 30,
    fontWeight: "bold",
    color: vars.SHELTER_RED,
    marginBottom: 10,
  },
  org_role: {
    fontSize: 14,
    color: vars.MEDIUM_GREY,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginLeft: 10,
  },
});
