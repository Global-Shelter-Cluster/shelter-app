// @flow

import type {Paragraph as ParagraphType} from "../../model/paragraphs";
import {StyleSheet, Text, View} from "react-native";
import React from "react";

const ParagraphTitle = ({paragraph}: {paragraph: ParagraphType}) => {
  if (paragraph.title === undefined || paragraph.title.trim() === '')
    return null;

  return <View style={styles.titleWrapper}>
    <Text style={styles.textTitle}>
      {paragraph.title.trim().toUpperCase()}
    </Text>
  </View>
};

const styles = StyleSheet.create({
  titleWrapper: {
    flex: 1,
    borderBottomWidth: 2,
    borderColor: "#717171",
    marginTop: 15,
    paddingBottom: 5,
  },
  textTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#313131",
  },
});

export default ParagraphTitle;
