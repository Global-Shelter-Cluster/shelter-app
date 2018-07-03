// @flow

import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import Button from './Button';
import type {PrivateUserObject, PublicUserObject} from "../model/user";
import vars from "../vars";
// import {FileSystem} from "expo";

export default ({user, showEdit, edit}: {
  user: PrivateUserObject | PublicUserObject,
  showEdit: boolean,
  edit: () => {},
}) => {
  const separator = user.org && user.role ? <Text> • </Text> : null;

  const org_role = (user.org || user.role)
    ? <Text style={styles.org_role}>
      <Text style={{fontWeight: "bold"}}>{user.org}</Text>
      {separator}
      <Text style={{fontStyle: "italic"}}>{user.role}</Text>
    </Text>
    : null;

  // console.log('user org', user.org);
  // console.log('user role', user.role);
  // if (user.picture.substr(0, 7) === 'file://') {
  //   FileSystem.getInfoAsync(user.picture).then(i => console.log('user pic info', i));
  //   // FileSystem.readAsStringAsync(user.picture).then(i => console.log('user pic data', i));
  // }
  // console.log('user pic', user.picture);

  return <View style={styles.container}>
    <View style={{flexShrink: 1}}>
      <Text style={styles.name}>{user.name}</Text>
      {org_role}
      {/*showEdit && <Button primary onPress={edit} title="Edit" icon="pencil"/>*/}
    </View>
    <Image key={user.picture} style={styles.photo} source={{uri: user.picture}}/>
  </View>;
}

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
