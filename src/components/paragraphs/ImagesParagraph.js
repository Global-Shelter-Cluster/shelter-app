// @flow

import React from 'react';
import {Modal, View} from 'react-native';
import type {ImagesParagraph as ImagesParagraphType} from "../../model/paragraphs";
import ParagraphTitle from "./ParagraphTitle";
import Slideshow from "../Slideshow";
import ImagesWithSlideshow from "../ImagesWithSlideshow";
import moment from "moment";

const ImagesParagraph = ({paragraph}: {paragraph: ImagesParagraphType}) => {
  const images = paragraph.images.map(image => ({
    title: image.title,
    thumbnail: image.url,
    url: image.url,
  }));

  return <View>
    <ParagraphTitle paragraph={paragraph}/>
    <ImagesWithSlideshow images={images}/>
  </View>;
};

export default ImagesParagraph;
