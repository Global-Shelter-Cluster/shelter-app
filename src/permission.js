// @flow

import * as Permissions from 'expo-permissions';

export async function ensurePermissions(...permissions: string): Promise<void> {
  console.log('ensurePermissions:', permissions);

  // As per Expo docs, we're supposed to be able to pass multiple permissions to getAsync and askAsync, but for some
  // reason it just doesn't work so we have to do it individually.

  for (const p of permissions) {
    const {status} = await Permissions.getAsync(p);

    if (status !== 'granted') {
      const {status} = await Permissions.askAsync(p);

      if (status !== 'granted')
        throw new Error('permission not granted: ' + p);
    }
  }
}
