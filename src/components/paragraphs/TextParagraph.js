// @flow

import React from 'react';
import type {TextParagraph as TextParagraphType} from "../../model/paragraphs";
import HTML from '../HTML';
import {StyleSheet, View} from "react-native";

const TextParagraph = ({paragraph}: { paragraph: TextParagraphType }) => (
  <View
    style={styles.container}
  >
    <HTML html={paragraph.body}/>
  </View>
);

export default TextParagraph;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
  },
});
