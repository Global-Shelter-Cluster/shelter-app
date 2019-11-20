// @flow

import React from 'react';
import {StyleSheet, View} from 'react-native';
import type {
  PublicationsParagraph as PublicationsParagraphType,
  PublicationsParagraphPublication
} from "../../model/paragraphs";
import vars from "../../vars";
import {hairlineWidth} from "../../util";
import SmartLinkContainer from "../../containers/SmartLinkContainer";
import HTML from "../HTML";

const renderPublication = (p: PublicationsParagraphPublication, index: number) => {
  return <View key={index} style={styles.pubContainer}>
    <SmartLinkContainer title={p.title} url={p.link} image={p.image}/>
    {p.description
      ? <View style={styles.descriptionContainer}>
        <HTML html={p.description}/>
    </View>
      : null
    }
  </View>
};

const PublicationsParagraph = ({paragraph}: { paragraph: PublicationsParagraphType }) => {
  return <View style={styles.container}>
    {paragraph.publications.map(renderPublication)}
  </View>;
};

export default PublicationsParagraph;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  descriptionContainer: {
    marginHorizontal: 10,
  },
  pubContainer: {
    borderColor: vars.LIGHT_GREY,
    borderBottomWidth: hairlineWidth,
    paddingVertical: 10,
  },
});
