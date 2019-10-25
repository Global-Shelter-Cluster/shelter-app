// @flow

import type {ObjectFileDescription, ObjectRequest} from "../persist";
import createCachedSelector from "re-reselect";
import {detailLevels, OBJECT_MODE_PUBLIC} from "./index";
import type {navigation} from "../nav";
import React from "react";

type PageType =
  "page"
  | "library"
  | "arbitrary_library"
  | "photo_gallery";

export type PublicBasicPageObject = {
  _last_read?: number,
  _mode: "public",
  _persist?: true,
  groups: Array<number>,
  type: "page",
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
  search: { [string]: { [string]: true } }, // e.g. {"field_technical_support_design": {"Training materials": true, ...}, ...}
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
      taken?: string, // date
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
  url: string,
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
              path: ".sections[" + section_index + "].photos[" + photo_index + "]",
              property: "url_thumbnail",
              url: photo.url_thumbnail,
            });

          if (photo.url_medium)
            files.push({
              type: "page",
              id: page.id,
              path: ".sections[" + section_index + "].photos[" + photo_index + "]",
              property: "url_medium",
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
    case "page":
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

export const getPageEnterFromSearchResult = (navigation: navigation, result: { objectID: string, type: PageType, url: string, _highlightResult: { title: { value: string } } }) => {
  const id = parseInt(result.objectID, 10);
  const plainTitle = result._highlightResult.title.value.replace(/<[^>]*>/g, '');

  // We can assume we're online, since search only works while online

  switch (result.type) {
    case "library":
      return () => navigation.push('Library', {pageId: id});

    case "arbitrary_library":
      return () => navigation.push('ArbitraryLibrary', {pageId: id});

    case "photo_gallery":
      return () => navigation.push('PhotoGallery', {pageId: id});

    default:
      return () => navigation.push('WebsiteViewer', {url: result.url, title: plainTitle});
  }
};

export const getPageEnter = createCachedSelector(
  state => state,
  (state, pageId) => pageId,
  (state, pageId, navigation) => navigation,
  state => state.flags.online,
  (state, pageId: number, navigation: navigation, online: boolean) => {
    if (state.objects.page[pageId] === undefined)
      return null;

    const page: PageObject = state.objects.page[pageId];

    switch (page.type) {
      case "page":
        if (!online)
          return null;

        return () => navigation.push('Page', {pageId: page.id});

      case "library":
        if (!online) // We need to be online since libraries work with Algolia
          return null;

        return () => navigation.push('Library', {pageId: page.id});

      case "arbitrary_library":
        if (!online && detailLevels[page._mode] < detailLevels[OBJECT_MODE_PUBLIC])
          return null;

        return () => navigation.push('ArbitraryLibrary', {pageId: page.id});

      case "photo_gallery":
        if (!online && detailLevels[page._mode] < detailLevels[OBJECT_MODE_PUBLIC])
          return null;

        return () => navigation.push('PhotoGallery', {pageId: page.id});

      default:
        return null;
    }
  }
)((state, pageId) => pageId);
