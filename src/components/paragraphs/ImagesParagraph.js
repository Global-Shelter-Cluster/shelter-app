// @flow

import React from 'react';
import type {ImagesParagraph as ImagesParagraphType} from "../../model/paragraphs";
import ImagesWithSlideshow from "../ImagesWithSlideshow";

const ImagesParagraph = ({paragraph}: {paragraph: ImagesParagraphType}) => {
  const images = paragraph.images.map(image => ({
    title: image.title,
    thumbnail: image.url,
    url: image.url,
  }));

  return <ImagesWithSlideshow images={images} bigThumbnails/>;
};

export default ImagesParagraph;
