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

export default ({group, link, isFollowed, display, factsheet, recentDocs, unseenAlerts, enter, ellipsizeMode, indent}: {
  group: GroupObject,
  link: boolean,
  isFollowed: boolean,
  display: "full" | "text-only",
  factsheet?: FactsheetObject,
  recentDocs?: number,
  unseenAlerts?: number,
  enter: () => {},
  ellipsizeMode?: string,
  indent?: true, // only used when display === "text-only"
}) => {
  const textStyles = ellipsizeMode !== undefined ? {ellipsizeMode} : {};

  switch (display) {
    case 'text-only': {
      const followedIcon = isFollowed
        ? <FontAwesome name="sign-in" size={18} style={{paddingBottom: 9}}/>
        : null;

      const titleContainerStyle = followedIcon
        ? [styles.textOnlyContainer, {marginRight: 20}]
        : styles.textOnlyContainer;
      const title = <View style={titleContainerStyle}>
        <Text style={[styles.textOnlyLabel, group.response_status === 'archived' ? styles.dimmed : null, indent ? styles.indent : null]} {...textStyles}>{group.title}</Text>
        {followedIcon}
      </View>;

      return link
        ? <TouchableOpacity onPress={enter} style={styles.textOnlyContainer}>
          {title}
          <FontAwesome
            name={"angle-right"} size={18} color={vars.MEDIUM_GREY}
            style={styles.textOnlyIcon}
          />
        </TouchableOpacity>
        : title;
    }
    case 'full': {
      const followedIcon = isFollowed
        ? <FontAwesome name="sign-in" color="white" size={18} style={{paddingTop: 2}}/>
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

      const titleContainerStyle = followedIcon
        ? {flex: 1, flexDirection: "row", marginRight: 20}
        : (link
            ? {flex: 1, flexDirection: "row"}
            : {flexDirection: "row"}
        );
      const title = <View key="title" style={titleContainerStyle}>
        <SingleLineText style={styles.fullLabel} {...textStyles}>{group.title}</SingleLineText>
        {followedIcon}
      </View>;

      const titleRow = link
        ? <View key="title" style={{flexDirection: "row"}}>
          {title}
          <FontAwesome
            name={"angle-right"} size={18} color="rgba(255,255,255,.5)"
            style={styles.fullIcon}
          />
        </View>
        : title;
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
    flex: 1,
    flexDirection: "row",
    paddingVertical: 3,
    alignItems: "center",
  },
  textOnlyLabel: {
    padding: 10,
    paddingTop: 0,
    paddingLeft: 20,
    fontSize: 18,
  },
  indent: {
    paddingLeft: 30,
  },
  dimmed: {
    opacity: .6,
  },
  textOnlyIcon: {
    paddingHorizontal: 10,
    paddingBottom: 10,
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
