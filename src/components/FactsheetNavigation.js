// @flow

import React from 'react';
import {SectionList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import vars from "../vars";
import type {FactsheetObject} from "../model/factsheet";
import SingleLineText from "./SingleLineText";
import {FontAwesome} from '@expo/vector-icons';
import moment from "moment/moment";
import {hairlineWidth} from "../util";

export default FactsheetNavigation = ({prev, next, enter}: {
  prev?: FactsheetObject,
  next?: FactsheetObject,
  enter: (id: number) => {},
}) => {
  if (!prev && !next)
    return null;

  const links = [];

  if (prev)
    links.push(<TouchableOpacity key="prev" onPress={() => enter(prev.id)} style={styles.linkContainer}>
      <FontAwesome
        name={"angle-left"} size={18} color={vars.MEDIUM_GREY}
        style={styles.icon}
      />
      <SingleLineText
        style={styles.label}>{moment(prev.date).format('MMM YYYY')}</SingleLineText>
    </TouchableOpacity>);

  if (next)
    links.push(<TouchableOpacity key="next" onPress={() => enter(next.id)} style={styles.linkContainer}>
      <SingleLineText
        style={[styles.label, {textAlign: "right"}]}>{moment(next.date).format('MMM YYYY')}</SingleLineText>
      <FontAwesome
        name={"angle-right"} size={18} color={vars.MEDIUM_GREY}
        style={styles.icon}
      />
    </TouchableOpacity>);

  return <View style={styles.container}>
    {links}
  </View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    borderColor: vars.LIGHT_GREY,
    borderTopWidth: hairlineWidth,
  },
  linkContainer: {
    flex: 1,
    flexDirection: "row",
  },
  label: {
    flex: 1,
    padding: 10,
    fontSize: 18,
  },
  icon: {
    paddingHorizontal: 10,
    paddingTop: 12,
  },
});
