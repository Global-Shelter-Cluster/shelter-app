// @flow

import React from 'react';
import {ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import type {GroupObject} from "../model/group";
import {getGroupTypeLabel} from "../model/group";
import type {FactsheetObject} from "../model/factsheet";
import {FontAwesome} from '@expo/vector-icons';
import vars from "../vars";
import SingleLineText from "./SingleLineText";
import Badge from "./Badge";
import {hairlineWidth} from "../util";

export default ({group, link, isFollowed, display, factsheet, recentDocs, unseenAlerts, enter}: {
  group: GroupObject,
  link: boolean,
  isFollowed: boolean,
  display: "full" | "text-only",
  factsheet?: FactsheetObject,
  recentDocs?: number,
  unseenAlerts?: number,
  enter: () => {},
}) => {
  switch (display) {
    case 'text-only': {
      const followedIcon = isFollowed
        ? <FontAwesome name="sign-in" size={18} style={{marginLeft: 10, marginTop: 2}}/>
        : null;

      return link
        ? <TouchableOpacity onPress={enter} style={styles.textOnlyContainer}>
          {followedIcon}
          <SingleLineText style={[styles.textOnlyLabel, {flex: 1}]}>{group.title}</SingleLineText>
          <FontAwesome
            name={"angle-right"} size={18} color={vars.MEDIUM_GREY}
            style={styles.textOnlyIcon}
          />
        </TouchableOpacity>
        : <View style={styles.textOnlyContainer}>
          {followedIcon}
          <SingleLineText style={styles.textOnlyLabel}>{group.title}</SingleLineText>
        </View>;
    }
    case 'full': {
      const followedIcon = isFollowed
        ? <FontAwesome name="sign-in" color="white" size={18} style={{marginLeft: 10, marginTop: 2}}/>
        : null;

      const badges = [];

      if (unseenAlerts && unseenAlerts > 0)
        badges.push(<Badge key="unseenAlerts" icon="bell-o" value={unseenAlerts} color="white"/>);

      if (group.kobo_forms !== undefined && group.kobo_forms.length > 0)
        badges.push(<Badge key="koboForms" icon="paper-plane-o" value={group.kobo_forms.length} color="white"/>);

      if (recentDocs && recentDocs > 0)
        badges.push(<Badge key="recentDocs" icon="file-o" value={recentDocs} color="white"/>);

      if (group.upcoming_events !== undefined && group.upcoming_events.length > 0)
        badges.push(<Badge key="upcomingEvents" icon="calendar" value={group.upcoming_events.length} color="white"/>);

      const typeLabel = getGroupTypeLabel(group).toUpperCase();
      const titleRow = link
        ? <View key="title" style={{flexDirection: "row"}}>
          {followedIcon}
          <SingleLineText style={[styles.fullLabel, {flex: 1}]}>{group.title}</SingleLineText>
          <FontAwesome
            name={"angle-right"} size={18} color="rgba(255,255,255,.5)"
            style={styles.fullIcon}
          />
        </View>
        : <View style={{flexDirection: "row"}}>
          {followedIcon}
          <SingleLineText key="title" style={styles.fullLabel}>{group.title}</SingleLineText>
        </View>;
      const contents = [
        <Text key="type" style={styles.typeLabel}>{typeLabel}</Text>,
        titleRow,
      ];

      if (badges.length > 0)
        contents.unshift(<View key="badges" style={styles.badges}>{badges}</View>);

      let image = factsheet ? {uri: factsheet.image} : null;
      if (image === null && group.image !== undefined)
        image = {uri: group.image};

      return link
        ? <ImageBackground
          source={image}
          style={styles.fullContainer}
        >
          <TouchableOpacity
            style={styles.fullInnerContainer}
            activeOpacity={0}
            onPress={enter}
          >
            {contents}
          </TouchableOpacity>
        </ImageBackground>
        : <ImageBackground
          source={image}
          style={styles.fullContainer}
        >
          <View style={styles.fullInnerContainer}>
            {contents}
          </View>
        </ImageBackground>;
    }
  }
}

const styles = StyleSheet.create({
  textOnlyContainer: {
    flexDirection: "row",
  },
  textOnlyLabel: {
    padding: 10,
    paddingTop: 0,
    fontSize: 18,
  },
  textOnlyIcon: {
    paddingHorizontal: 10,
    paddingTop: 2,
  },
  fullIcon: {
    paddingLeft: 10,
    paddingTop: 2,
  },
  fullContainer: {
    height: 100,
    marginBottom: hairlineWidth,
  },
  fullInnerContainer: {
    padding: 10,
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,.6)",
  },
  fullLabel: {
    color: "white",
    fontSize: 18,
    margin: 10,
    marginTop: 0,
  },
  typeLabel: {
    color: "white",
    opacity: .75,
    fontSize: 10,
    marginHorizontal: 10,
  },
  badges: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
