// @flow

import {Notifications, Permissions} from "expo";
import config from "./config";

export async function getPushToken(): Promise<string | null> {
  if (config.localConfigs && config.localConfigs.bypassPushNotification) {
    return;
  }

  const {status: existingStatus} = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== 'granted') {
    // On android this permission is granted by default and not opt-in.
    const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== 'granted') {
    return null;
  }

  // Get the token that uniquely identifies this device
  const token = await Notifications.getExpoPushTokenAsync();

  return token;
}
