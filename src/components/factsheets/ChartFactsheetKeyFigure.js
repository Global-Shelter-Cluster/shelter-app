// @flow

import React from 'react';
import type {ChartFactsheetKeyFigure as ChartFactsheetKeyFigureType} from "../../model/factsheet";
import {Dimensions, StyleSheet, View} from "react-native";
import TranslatedText from "../TranslatedText";
import vars from "../../vars";
import FitImage from "react-native-fit-image";
import HTML from "../HTML";

const ChartFactsheetKeyFigure = ({keyFigure}: { keyFigure: ChartFactsheetKeyFigureType }) => {
  const smallImage = keyFigure.smallImage !== undefined && keyFigure.smallImage;

  const description = keyFigure.description !== undefined ?
    <View style={smallImage ? styles.smallImageDescription : styles.description}>
      <HTML
        html={keyFigure.description}
        tagsStyles={{p: {marginBottom: 5}, strong: {fontSize: 20}}}
      />
    </View>:
    null;

  const image = <FitImage
    style={smallImage ? styles.smallImage : styles.image}
    source={{uri: keyFigure.chart}}
  />;

  return <View style={styles.container}>
    <TranslatedText style={styles.title}>{keyFigure.title}</TranslatedText>
    {smallImage ?
      <View style={styles.smallImageInnerContainer}>
        {image}
        {description}
      </View> :
      <View>
        {description}
        {image}
      </View>
    }
  </View>;
};

export default ChartFactsheetKeyFigure;

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  smallImageInnerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    color: vars.SHELTER_GREY,
    fontWeight: "bold",
  },
  image: {
    flex: 1,
  },
  description: {
    flex: 1,
  },
  smallImageDescription: {
    flex: 2,
  },
  smallImage: {
    flex: 1,
    margin: 10,
  },
});
