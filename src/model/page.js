// @flow

import type {ObjectFileDescription, ObjectRequest} from "../persist";

type PageType =
  "basic_page"
  | "library"
  | "arbitrary_library"
  | "photo_gallery";

export type PublicBasicPageObject = {
  _last_read?: number,
  _mode: "public",
  _persist?: true,
  groups: Array<number>,
  type: "basic_page",
  id: number,
  title: string,
  url: string,
  body: string, // HTML
}

export type PublicLibraryPageObject = {
  _last_read?: number,
  _mode: "public",
  _persist?: true,
  groups: Array<number>,
  type: "library",
  id: number,
  title: string,
  url: string,
  body?: string, // HTML
  is_global_library?: true,
  // search: ? // algolia params based on taxonomy/lang/etc. filters defined in the library
}

export type PublicArbitraryLibraryPageObject = {
  _last_read?: number,
  _mode: "public",
  _persist?: true,
  groups: Array<number>,
  type: "arbitrary_library",
  id: number,
  title: string,
  url: string,
  body?: string, // HTML
  documents?: Array<number>,
}

export type PublicPhotoGalleryPageObject = {
  _last_read?: number,
  _mode: "public",
  _persist?: true,
  groups: Array<number>,
  type: "photo_gallery",
  id: number,
  title: string,
  url: string,
  body?: string, // HTML
  sections: Array<{
    title?: string,
    description?: string, // plain text
    photos: Array<{
      url_thumbnail: string, // URL
      url_medium: string, // URL
      url_full: string, // URL
      url_original: string, // URL
      author: string,
      taken?: Date,
      caption?: string, // plain text
    }>,
  }>,
}

export type StubPageObject = {
  _last_read?: number,
  _mode: "stub",
  _persist?: true,
  type: PageType,
  id: number,
  title: string,
}

export type PublicPageObject =
  PublicBasicPageObject
  | PublicLibraryPageObject
  | PublicArbitraryLibraryPageObject
  | PublicPhotoGalleryPageObject;

export type PageObject = StubPageObject | PublicPageObject;

export default class Page {
  static getRelated(page: PageObject): Array<ObjectRequest> {
    const ret = [];

    if (page.groups !== undefined)
      ret.push(...page.groups.map(id => ({type: "group", id: id})));

    if (page.documents !== undefined)
      ret.push(...page.documents.map(id => ({type: "document", id: id})));

    return ret;
  }

  static getFiles(page: PageObject): Array<ObjectFileDescription> {
    const files = [];

    if (page.type === "photo_gallery" && page.sections !== undefined) {
      page.sections.map((section, section_index) => {
        if (section.photos === undefined)
          return;

        section.photos.map((photo, photo_index) => {
          if (photo.url_thumbnail)
            files.push({
              type: "page",
              id: page.id,
              json_path: "$.sections[" + section_index + "].photos[" + photo_index + "].url_thumbnail",
              url: photo.url_thumbnail,
            });

          if (photo.url_medium)
            files.push({
              type: "page",
              id: page.id,
              json_path: "$.sections[" + section_index + "].photos[" + photo_index + "].url_medium",
              url: photo.url_medium,
            });
        });
      });
    }

    return files;
  }
}

export const getPageTypeLabel = (page: PageObject) => {
  switch (page.type) {
    case "basic_page":
      return "Page";
    case "library":
      return "Library";
    case "arbitrary_library":
      return "Library";
    case "photo_gallery":
      return "Photo gallery";
    default:
      return '';
  }
};
