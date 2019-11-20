// @flow

import type {ObjectFileDescription, ObjectRequest} from "../persist";
import type {HtmlString, UrlString} from "./index";

export type TextParagraph = {
  type: "text",
  title?: string,
  body: HtmlString,
}

export type ImagesParagraph = {
  type: "images",
  title?: string,
  images: Array<{
    url: UrlString,
    alt: string,
    title: string,
  }>,
}

export type LinksParagraph = {
  type: "links",
  title?: string,
  links: Array<{
    url: UrlString,
    title: string,
  }>,
}

export type TableParagraphCell = {
  title?: string,
  url?: UrlString,
}

export type TableParagraph = {
  type: "table",
  title?: string,
  headers?: Array<string>,
  rows?: Array<Array<TableParagraphCell>>,
}

export type PublicationsParagraphPublication = {
  title: string,
  link?: UrlString,
  image?: UrlString,
  description?: HtmlString,
}

export type ShortPublicationsParagraphPublication = {
  title: string,
  link?: UrlString,
  image?: UrlString,
}

export type PublicationsParagraph = {
  type: "publications",
  title?: string,
  publications: Array<PublicationsParagraphPublication>,
}

export type ShortPublicationsParagraph = {
  type: "short_publications",
  title?: string,
  publications: Array<ShortPublicationsParagraphPublication>,
}

export type TeamMembersParagraphMember = {
  name: string,
  link?: UrlString,
  org?: string,
  photo?: UrlString,
}

export type TeamMembersParagraph = {
  type: "team_members",
  title?: string,
  description?: HtmlString,
  members: Array<TeamMembersParagraphMember>,
}

export type Paragraph =
  TextParagraph
  | ImagesParagraph
  | LinksParagraph
  | TableParagraph
  | PublicationsParagraph
  | ShortPublicationsParagraph
  | TeamMembersParagraph;

export type Paragraphs = Array<Paragraph>

export const getRelatedFromParagraphs = (ret: Array<ObjectRequest>, paragraphs: Paragraphs) => {
  // Nothing for now
};

export const getFilesFromParagraphs = (files: Array<ObjectFileDescription>, paragraphs: Paragraphs, objectType: string, objectId: number, basePath: string) => {
  paragraphs.map((paragraph, paragraph_index) => {
    switch (paragraph.type) {
      case "images":
        if (paragraph.images === undefined)
          break;

        paragraph.images.map((image, image_index) => {
          if (image.url)
            files.push({
              type: objectType,
              id: objectId,
              path: basePath + "[" + paragraph_index + "].images[" + image_index + "]",
              property: "url",
              url: image.url,
            });
        });

        break;

      case "publications": // fall-through
      case "short_publications":
        if (paragraph.publications === undefined)
          break;

        paragraph.publications.map((publication, pub_index) => {
          if (publication.image)
            files.push({
              type: objectType,
              id: objectId,
              path: basePath + "[" + paragraph_index + "].publications[" + pub_index + "]",
              property: "image",
              url: publication.image,
            });
        });

        break;

      case "team_members":
        if (paragraph.members === undefined)
          break;

        paragraph.members.map((member, member_index) => {
          if (member.photo)
            files.push({
              type: objectType,
              id: objectId,
              path: basePath + "[" + paragraph_index + "].members[" + member_index + "]",
              property: "photo",
              url: member.photo,
            });
        });

        break;
    }
  });
};
