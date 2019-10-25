// @flow

import React from 'react';
import {View} from 'react-native';
import type {LinksParagraph as LinksParagraphType} from "../../model/paragraphs";
import ParagraphTitle from "./ParagraphTitle";
import SmartLinkContainer from "../../containers/SmartLinkContainer";

const LinksParagraph = ({paragraph}: {paragraph: LinksParagraphType}) => {
  const links = paragraph.links.map((link, index) => (
    <SmartLinkContainer key={index} {...link}/>
  ));

  return <View>
    <ParagraphTitle paragraph={paragraph}/>
    {links}
  </View>;
};

export default LinksParagraph;
