// @flow

import { Notifications } from "expo";
import * as Permissions from 'expo-permissions';
import config from "./config";
import {ensurePermissions} from "./permission";

export async function getPushToken(): Promise<string | null> {
  if (config.localConfigs && config.localConfigs.bypassPushNotification) {
    return;
  }

  try {
    await ensurePermissions(Permissions.NOTIFICATIONS);
  } catch(e) {
    return null;
  }

  // Get the token that uniquely identifies this device
  const token = await Notifications.getExpoPushTokenAsync();

  return token;
}
