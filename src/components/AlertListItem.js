// @flow

import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import type {AlertObject} from "../model/alert";
import vars from "../vars";
import {hairlineWidth, timeAgo} from "../util";
import HTML from 'react-native-render-html';
import type {GroupObject} from "../model/group";

export default ({alert, group, isSeen, markSeen, enter, linkType, isTeaser}: {
  alert: AlertObject,
  group: GroupObject,
  isSeen: boolean,
  markSeen: () => {},
  enter?: () => {},
  linkType?: 'document' | 'event' | 'factsheet' | 'kobo_form' | 'webform' | 'group' | 'url',
  isTeaser: boolean,
}) => {
  const groupLabel = isTeaser
    ? <Text style={styles.group}>{group.title.toUpperCase()}</Text>
    : null;

  const contents = [
    <View key="info" style={styles.info}>
      {groupLabel}
      <Text numberOfLines={4} ellipsizeMode="tail"
            style={[styles.title, isSeen ? null : styles.unseen]}>{alert.title}</Text>
      <Text style={styles.secondary}>{timeAgo(alert.created, 4, true)}</Text>
      {!isTeaser && alert.description !== undefined && alert.description && <HTML html={alert.description}/>}
    </View>,
  ];

  const icons = {
    'document': "file-o",
    'event': "calendar",
    'factsheet': "bar-chart",
    'kobo_form': "paper-plane-o",
    'webform': "paper-plane-o",
    'group': "users",
    'url': "globe",
  };

  const linkTypeIcon = !isTeaser && linkType !== undefined && icons[linkType] !== undefined
    ? <FontAwesome
      name={icons[linkType]} size={18} color={vars.MEDIUM_GREY}
      style={styles.rightArrow}
    />
    : null;


  const isClickable = enter !== undefined || !isSeen;

  return isClickable
    ? <TouchableOpacity
      style={[styles.container, isSeen ? null : styles.containerUnseen]}
      onPress={() => {
        if (!isTeaser)
          markSeen();
        if (enter !== undefined) enter();
      }}
    >
      {contents}
      {linkTypeIcon}
      <FontAwesome
        name={"angle-right"} size={18} color={vars.MEDIUM_GREY}
        style={styles.rightArrow}
      />
    </TouchableOpacity>
    : <View style={styles.container}>
      {contents}
      {linkTypeIcon}
    </View>
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    borderColor: vars.SHELTER_GREY,
    borderTopWidth: hairlineWidth,
    borderBottomWidth: hairlineWidth,
    marginBottom: 5,
    backgroundColor: 'rgba(255,177,0,.1)',
  },
  containerUnseen: {
    backgroundColor: 'rgba(255,177,0,.2)',
  },
  map: {
    width: 120,
    height: 120,
    resizeMode: "cover",
    borderWidth: hairlineWidth,
    borderColor: vars.SHELTER_GREY,
  },
  mapBlank: {
    width: 120,
    height: 120,
    borderWidth: hairlineWidth,
    borderColor: vars.SHELTER_GREY,
  },
  info: {
    flex: 1,
    marginRight: 10,
  },
  group: {
    fontSize: 10,
    color: vars.SHELTER_GREY,
  },
  title: {
    fontSize: 18,
    marginBottom: 4,
  },
  unseen: {
    fontWeight: "bold",
  },
  secondary: {
    color: vars.SHELTER_GREY,
  },
  rightArrow: {
    paddingLeft: 10,
    paddingTop: 2,
  },
});
