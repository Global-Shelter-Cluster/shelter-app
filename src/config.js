// @flow

import prodReleaseChannelCounter from '../PROD_RELEASE_CHANNEL';

export type configType = {
  baseUrl: string,
  axiosExtra: {},
  deleteFilesOnLogout: boolean,
  reduxLogger: boolean,
  persistFiles: boolean,
  debugMode: boolean, // allows toggling online/offline and clearing cache with a "long press" on the indicator, and some extra settings
  googleAnalyticsTrackingId: string,
};

const config: { [string]: configType } = {
  local: {
    baseUrl: 'http://local.sheltercluster.org.192.168.0.11.xip.io',
    axiosExtra: {},
    deleteFilesOnLogout: false,
    reduxLogger: true,
    persistFiles: false,
    debugMode: true,
    googleAnalyticsTrackingId: 'UA-26890288-4',
  },
  local_jm: {
    baseUrl: 'http://10.36.36.102:32776',
    axiosExtra: {},
    deleteFilesOnLogout: false,
    reduxLogger: false,
    persistFiles: false,
    debugMode: true,
    googleAnalyticsTrackingId: 'UA-26890288-4',
  },
  dev: {
    baseUrl: 'http://dev.sheltercluster.org',
    axiosExtra: {},
    deleteFilesOnLogout: true,
    reduxLogger: true,
    persistFiles: true,
    debugMode: true,
    googleAnalyticsTrackingId: 'UA-26890288-4',
  },
  stage: {
    baseUrl: 'http://stage.sheltercluster.org',
    axiosExtra: {},
    deleteFilesOnLogout: true,
    reduxLogger: false,
    persistFiles: true,
    debugMode: false,
    googleAnalyticsTrackingId: 'UA-26890288-4',
  },
  ['prod' + prodReleaseChannelCounter]: {
    baseUrl: 'https://www.sheltercluster.org',
    axiosExtra: {},
    deleteFilesOnLogout: true,
    reduxLogger: false,
    persistFiles: true,
    debugMode: false,
    googleAnalyticsTrackingId: 'UA-26890288-3',
  }
};

const channel = config[Expo.Constants.manifest.releaseChannel] !== undefined
  ? Expo.Constants.manifest.releaseChannel
  // : 'local';
  : 'dev';
  // : 'stage';
  // : 'local_jm';

export default config[channel];
