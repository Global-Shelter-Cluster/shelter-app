// @flow

import React from 'react';
import {Platform, StyleSheet, Text} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import vars from "../vars";

const NavTitle = ({online, title, downloading}: {
  online: boolean,
  title: string,
  downloading: { value: number, total: number },
}) => {
  const icons = [];

  if (!online)
    icons.push(<FontAwesome key="online" name="wifi" size={20} color={vars.ACCENT_RED}/>);

  if (downloading.total > 0) {
    const downloadingIcons = [
      'hourglass-start',
      'hourglass-half',
      'hourglass-end',
    ];

    const downloadingIcon = downloadingIcons[Math.min(
      downloadingIcons.length - 1,
      Math.floor(downloading.value / downloading.total * downloadingIcons.length)
    )];
    icons.push(<FontAwesome key="downloading" name={downloadingIcon} size={20}/>);
  }

  if (icons.length === 0)
    return <Text style={[styles.title, styles.container]} numberOfLines={1} ellipsizeMode="tail">{title}</Text>;
  else
    return <Text style={styles.container} numberOfLines={1}>
      {icons}
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