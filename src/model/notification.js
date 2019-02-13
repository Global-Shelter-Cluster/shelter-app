// @flow

import createCachedSelector from "re-reselect";
import type {navigation} from "../nav";
import type {notificationType} from "../reducers/notification";

export const getNotificationEnter = createCachedSelector(
  state => state.notification,
  (state, navigation) => navigation,
  state => state.flags.online,
  (notification: notificationType, navigation: navigation, online: boolean) => {
    console.log('notificationEnter', notification);
    return () => navigation.push('Group', {groupId: 97});
  }
)((state, pageId) => pageId);
