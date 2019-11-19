// @flow

import React from 'react';
import {View} from 'react-native';
import type {Paragraphs as ParagraphsType} from "../../model/paragraphs";
import TextParagraph from "./TextParagraph";
import ImagesParagraph from "./ImagesParagraph";
import LinksParagraph from "./LinksParagraph";
import TableParagraph from "./TableParagraph";
import PublicationsParagraph from "./PublicationsParagraph";
import ShortPublicationsParagraph from "./ShortPublicationsParagraph";
import TeamMembersParagraph from "./TeamMembersParagraph";
import Collapsible from "../Collapsible";

const renderParagraphs = (paragraphs: Array<ParagraphsType>) => paragraphs.map((paragraph, i) => {
  switch (paragraph.type) {
    case "text":
      return <TextParagraph key={i} paragraph={paragraph}/>;
    case "images":
      return <ImagesParagraph key={i} paragraph={paragraph}/>;
    case "links":
      return <LinksParagraph key={i} paragraph={paragraph}/>;
    case "table":
      return <TableParagraph key={i} paragraph={paragraph}/>;
    case "publications":
      return <PublicationsParagraph key={i} paragraph={paragraph}/>;
    case "short_publications":
      return <ShortPublicationsParagraph key={i} paragraph={paragraph}/>;
    case "team_members":
      return <TeamMembersParagraph key={i} paragraph={paragraph}/>;
    default:
      console.warn("Unknown paragraph type", paragraph.type);
  }
});

type headerType = Array<ParagraphsType>;

type sectionType = Array<{
  title: string,
  paragraphs: Array<ParagraphsType>,
}>;

const Paragraphs = ({paragraphs}: { paragraphs: ParagraphsType }) => {
  const header: headerType = []; // paragraph(s) without title, shown outside of a collapsible element
  const sections: sectionType = []; // regular sections, with title, shown inside collapsible elements

  let isHeader = true;
  for (let paragraph of paragraphs) {
    const title = paragraph.title !== undefined && paragraph.title.trim() !== ''
      ? paragraph.title
      : null;

    if (isHeader && title)
      isHeader = false;

    if (isHeader)
      header.push(paragraph);
    else if (title)
      sections.push({title, paragraphs: [paragraph]});
    else
      sections[sections.length - 1].paragraphs.push(paragraph);
  }

  return <View>
    {renderParagraphs(header)}
    {sections.map((section, sectionIndex) =>
      <Collapsible
        title={section.title}
        isOpen={header.length === 0 && sections.length === 1}
        noHorizontalMargins
      >
        {renderParagraphs(section.paragraphs)}
      </Collapsible>
    )}
  </View>;
};

export default Paragraphs;
