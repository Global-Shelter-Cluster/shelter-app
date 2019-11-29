// @flow

import React from 'react';
import type {NumberFactsheetKeyFigure as NumberFactsheetKeyFigureType} from "../../model/factsheet";
import {StyleSheet, Text, View} from "react-native";
import TranslatedText from "../TranslatedText";

const NumberFactsheetKeyFigure = ({keyFigure}: { keyFigure: NumberFactsheetKeyFigureType }) => (
  <View style={styles.container}>
    <Text style={styles.value}>{keyFigure.value}</Text>
    <TranslatedText style={styles.label}>{keyFigure.label}</TranslatedText>
  </View>
);

export default NumberFactsheetKeyFigure;

const styles = StyleSheet.create({
  container: {
    margin: 20,
    alignItems: "center",
  },
  value: {
    fontSize: 48,
  },
  label: {
  },
});
