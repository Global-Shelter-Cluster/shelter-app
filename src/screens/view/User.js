// @flow

import React from 'react';
import {Image, Linking, RefreshControl, ScrollView, Share, StyleSheet, Text, View} from 'react-native';
import type {UserObject} from "../../model/user";
import ContactActionsContainer from "../../containers/ContactActionsContainer";
import type {lastErrorType} from "../../reducers/lastError";
import vars from "../../vars";
import {hairlineWidth} from "../../util";
import {FontAwesome} from '@expo/vector-icons';
import equal from "deep-equal";
import Button from "../../components/Button";
import Loading from "../../components/Loading";

export default ({online, user, loaded, refresh, loading, lastError}: {
  online: boolean,
  loading: boolean,
  user: UserObject,
  loaded: boolean,
  refresh: () => void,
  lastError: lastErrorType,
}) => {
  if (!loaded && equal(lastError, {type: 'object-load', data: {type: 'user', id: user.id}}))
    return <Button
      onPress={refresh}
      title="Error loading, please check your connection and try again"
    />;
  if (!loaded)
    return <Loading/>;

  const contact = Object.assign({}, user);

  // Convert "user" model to "contact" model (e.g. email is an array instead of a single value).
  // We do this to reuse the ContactActionsContainer component.
  if (contact.mail !== undefined)
    contact.mail = [contact.mail];

  return <View style={{flex: 1}}>
    <ScrollView
      style={{flex: 1}}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
    >
      <Text style={styles.title}>{user.name}</Text>
      <View style={styles.info}>
        {user.picture !== undefined && user.picture
          ? <Image key="picture" style={styles.picture} source={{uri: user.picture}}/>
          : null
        }
        <View style={{flex: 1}}>
          {user.org !== undefined
            ? <Text style={styles.secondary}>
              <FontAwesome name="building-o"/>
              {" " + user.org}
            </Text>
            : null
          }
          {user.role !== undefined
            ? <Text style={styles.secondary}>
              <FontAwesome name="briefcase"/>
              {" " + user.role}
            </Text>
            : null
          }
        </View>
      </View>
    </ScrollView>
    <ContactActionsContainer contact={contact}/>
  </View>;
}

const styles = StyleSheet.create({
  info: {
    flexDirection: "row",
    margin: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
    marginBottom: 10,
    color: vars.SHELTER_RED,
  },
  secondary: {
    color: vars.SHELTER_GREY,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  picture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    resizeMode: "cover",
    borderWidth: hairlineWidth,
    borderColor: vars.SHELTER_GREY,
    marginRight: 10,
  },
});
