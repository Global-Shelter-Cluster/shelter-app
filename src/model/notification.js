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
              return navService.navigate('DocumentList', {groupId: notification.id, which: link[2]});
            else
              return navService.navigate('DocumentList', {groupId: notification.id});
        }

        if (shouldRefresh)
          persist.store.dispatch(loadObject('group', notification.id, false, true));
        return navService.navigate('Group', {groupId: notification.id});

      case 'factsheet':
        if (shouldRefresh)
          persist.store.dispatch(loadObject('factsheet', notification.id, false, true));
        return navService.navigate('Factsheet', {factsheetId: notification.id});

      case 'document':
        if (shouldRefresh)
          persist.store.dispatch(loadObject('document', notification.id, false, true));
        return navService.navigate('Document', {documentId: notification.id});
    }
  }
);
