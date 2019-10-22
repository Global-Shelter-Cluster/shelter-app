// @flow

import React from 'react';
import {View} from 'react-native';
import type {TextParagraph as TextParagraphType} from "../../model/paragraphs";
import HTML from '../HTML';
import ParagraphTitle from "./ParagraphTitle";

const TextParagraph = ({paragraph}: {paragraph: TextParagraphType}) => (
  <View>
    <ParagraphTitle paragraph={paragraph}/>
    <HTML html={paragraph.body}/>
  </View>
);

export default TextParagraph;
