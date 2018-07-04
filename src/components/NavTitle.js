// @flow

import React from 'react';
import {Platform, StyleSheet, Text} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import Hourglasses from '../hourglasses';
import vars from "../vars";

const NavTitle = ({online, title, downloading}: {
  online: boolean,
  title: string,
  downloading: { value: number, total: number },
}) => {
  let icon = null;

  if (!online)
    icon = <FontAwesome key="online" name="wifi" size={20} color={vars.ACCENT_RED}/>;
  else if (downloading.total > 0) {
    const downloadingIcons = [
      'hourglass-01',
      'hourglass-02',
      'hourglass-03',
      'hourglass-04',
      'hourglass-05',
      'hourglass-06',
      'hourglass-07',
      'hourglass-08',
      'hourglass-09',
      'hourglass-10',
      'hourglass-11',
      'hourglass-12',
      'hourglass-13',
      'hourglass-14',
      'hourglass-15',
      'hourglass-16',
      'hourglass-17',
      'hourglass-18',
      'hourglass-19',
      'hourglass-20',
      'hourglass-21',
      'hourglass-22',
      'hourglass-23',
      'hourglass-24',
    ];

    const downloadingIcon = downloadingIcons[Math.min(
      downloadingIcons.length - 1,
      Math.floor(downloading.value / downloading.total * downloadingIcons.length)
    )];
    // icon = <FontAwesome key="downloading" name={downloadingIcon} size={20}/>;
    icon = <Hourglasses key="downloading" name={downloadingIcon} size={20}/>;
  }

  if (icon === null)
    return <Text style={[styles.title, styles.container]} numberOfLines={1} ellipsizeMode="tail">{title}</Text>;
  else
    return <Text style={styles.container} numberOfLines={1}>
      {icon}
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{" " + title}</Text>
    </Text>;
};

export default NavTitle;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  title: Platform.OS === 'ios'
    ? {
      fontSize: 17,
      color: "rgba(0,0,0,.9)",
      fontWeight: "700",
    }
    : {
      fontSize: 20,
      color: "rgba(0,0,0,.9)",
      fontWeight: "500",
    },
});
