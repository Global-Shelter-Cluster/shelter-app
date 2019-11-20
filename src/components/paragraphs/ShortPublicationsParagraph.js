// @flow

import React from 'react';
import {View} from 'react-native';
import type {
  ShortPublicationsParagraph as ShortPublicationsParagraphType,
  ShortPublicationsParagraphPublication
} from "../../model/paragraphs";
import SmartLinkContainer from "../../containers/SmartLinkContainer";

const renderPublication = (p: ShortPublicationsParagraphPublication, index: number) => {
  return <View key={index}>
    <SmartLinkContainer title={p.title} url={p.link} image={p.image}/>
  </View>
};

const ShortPublicationsParagraph = ({paragraph}: { paragraph: ShortPublicationsParagraphType }) => {
  return <View>
    {paragraph.publications.map(renderPublication)}
  </View>;
};

export default ShortPublicationsParagraph;
