// @flow

import React from 'react';
import {View} from 'react-native';
import type {ImagesParagraph as ImagesParagraphType} from "../../model/paragraphs";
import ParagraphTitle from "./ParagraphTitle";
import ImagesWithSlideshow from "../ImagesWithSlideshow";

const ImagesParagraph = ({paragraph}: {paragraph: ImagesParagraphType}) => {
  const images = paragraph.images.map(image => ({
    title: image.title,
    thumbnail: image.url,
    url: image.url,
  }));

  return <View>
    <ParagraphTitle paragraph={paragraph}/>
    <ImagesWithSlideshow images={images} bigThumbnails/>
  </View>;
};

export default ImagesParagraph;
