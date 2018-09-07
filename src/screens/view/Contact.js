// @flow

import React from 'react';
import {Image, Linking, RefreshControl, ScrollView, Share, StyleSheet, Text, View} from 'react-native';
import type {PublicContactObject} from "../../model/contact";
import ContextualNavigation from "../../components/ContextualNavigation";
import ContactActionsContainer from "../../containers/ContactActionsContainer";
import type {lastErrorType} from "../../reducers/lastError";
import vars from "../../vars";
import HTML from 'react-native-render-html';
import {hairlineWidth} from "../../util";
import {FontAwesome} from '@expo/vector-icons';

export default ({online, contact, loaded, refresh, loading, lastError}: {
  online: boolean,
  loading: boolean,
  contact: PublicContactObject,
  loaded: boolean,
  refresh: () => void,
  lastError: lastErrorType,
}) => {
  return <View style={{flex: 1}}>
    <ScrollView
      style={{flex: 1}}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
    >
      <Text style={styles.title}>{contact.name}</Text>
      <ContextualNavigation object={contact}/>
      <View style={styles.info}>
        {contact.picture !== undefined && contact.picture
          ? <Image key="picture" style={styles.picture} source={{uri: contact.picture}}/>
          : null
        }
        <View style={{flex: 1}}>
          {contact.org !== undefined
            ? <Text style={styles.secondary}>
              <FontAwesome name="building-o"/>
              {" " + contact.org}
            </Text>
            : null
          }
          {contact.role !== undefined
            ? <Text style={styles.secondary}>
              <FontAwesome name="briefcase"/>
              {" " + contact.role}
            </Text>
            : null
          }
          {contact.bio !== undefined && contact.bio
            ? <HTML html={contact.bio}/>
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
