// @flow

import React from 'react';
import {View} from 'react-native';
import type {Paragraphs as ParagraphsType} from "../../model/paragraphs";
import TextParagraph from "./TextParagraph";
import ImagesParagraph from "./ImagesParagraph";
import LinksParagraph from "./LinksParagraph";
import TableParagraph from "./TableParagraph";

const Paragraphs = ({paragraphs}: { paragraphs: ParagraphsType }) => (
  <View>
    {paragraphs.map((paragraph, i) => {
      switch (paragraph.type) {
        case "text":
          return <TextParagraph key={i} paragraph={paragraph}/>;
        case "images":
          return <ImagesParagraph key={i} paragraph={paragraph}/>;
        case "links":
          return <LinksParagraph key={i} paragraph={paragraph}/>;
        case "table":
          return <TableParagraph key={i} paragraph={paragraph}/>;
        default:
          console.warn("Unknown paragraph type", paragraph.type);
      }
    })}
  </View>
);

export default Paragraphs;
