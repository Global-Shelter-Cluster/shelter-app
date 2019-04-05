// @flow

import {createSelector} from 'reselect';
import {navService} from "../nav";
import type {notificationType} from "../reducers/notification";
import {loadObject} from "../actions";
import persist from "../persist";

export const notificationEnter = createSelector(
  state => state.notification,
  state => state.flags.online,
  (notification: notificationType, online: boolean) => {
    if (!notification || !notification.link)
      return;

    const shouldRefresh = (online && persist.store) ? true : false;
    const link = notification.link.split(':');

    switch (link[0]) {
      case 'group':
        if (link[1]) switch (link[1]) {
          case 'documents':
            if (shouldRefresh)
              persist.store.dispatch(loadObject('group', notification.id, false, true));
            if (link[2]) // tab (e.g. "featured")
              return navService.push('DocumentList', {groupId: notification.id, which: link[2]});
            else
              return navService.push('DocumentList', {groupId: notification.id});

          case 'pages':
            if (shouldRefresh)
              persist.store.dispatch(loadObject('group', notification.id, false, true));
            console.log('CAM group nav3 group:pages', {groupId: notification.id, which: link[1]});
            return navService.push('Group', {groupId: notification.id, which: link[1]});
        }

        if (shouldRefresh)
          persist.store.dispatch(loadObject('group', notification.id, false, true));
        return navService.push('Group', {groupId: notification.id});

      case 'factsheet':
        if (shouldRefresh)
          persist.store.dispatch(loadObject('factsheet', notification.id, false, true));
        return navService.push('Factsheet', {factsheetId: notification.id});

      case 'document':
        if (shouldRefresh)
          persist.store.dispatch(loadObject('document', notification.id, false, true));
        return navService.push('Document', {documentId: notification.id});

      case 'library':
        if (shouldRefresh)
          persist.store.dispatch(loadObject('page', notification.id, false, true));
        return navService.push('Library', {pageId: notification.id});

      case 'arbitrary_library':
        if (shouldRefresh)
          persist.store.dispatch(loadObject('page', notification.id, false, true));
        return navService.push('ArbitraryLibrary', {pageId: notification.id});

      case 'photo_gallery':
        if (shouldRefresh)
          persist.store.dispatch(loadObject('page', notification.id, false, true));
        return navService.push('PhotoGallery', {pageId: notification.id});

      case 'page':
        return navService.push('WebsiteViewer', {url: notification.page_url, title: notification.page_title});
    }
  }
);
