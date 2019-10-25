// @flow

import type {ObjectFileDescription, ObjectRequest} from "../persist";

export type TextParagraph = {
  type: "text",
  title?: string,
  body: string, // HTML
}

export type ImagesParagraph = {
  type: "images",
  title?: string,
  images: Array<{
    url: string,
    alt: string,
    title: string,
  }>,
}

export type LinksParagraph = {
  type: "links",
  title?: string,
  links: Array<{
    url: string,
    title: string,
  }>,
}

export type TableParagraphCell = {
  title?: string,
  url?: string,
}

export type TableParagraph = {
  type: "table",
  title?: string,
  headers?: Array<string>,
  rows?: Array<Array<TableParagraphCell>>,
}

export type Paragraph = TextParagraph | ImagesParagraph | LinksParagraph | TableParagraph;

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
    }
  });
};
