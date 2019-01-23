// @flow

export type configType = {
  baseUrl: string,
  axiosExtra: {},
  deleteFilesOnLogout: boolean,
  reduxLogger: boolean,
  persistFiles: boolean,
  debugOnlineIndicator: boolean, // allows toggling online/offline and clearing cache with a "long press" on the indicator
  googleAnalyticsTrackingId: string,
};

const config: { [string]: configType } = {
  local: {
    baseUrl: 'http://local.sheltercluster.org.192.168.0.11.xip.io',
    axiosExtra: {},
    deleteFilesOnLogout: false,
    reduxLogger: true,
    persistFiles: false,
    debugOnlineIndicator: true,
    googleAnalyticsTrackingId: 'UA-26890288-4',
  },
  local_jm: {
    baseUrl: 'http://10.36.36.141:32828',
    axiosExtra: {},
    deleteFilesOnLogout: false,
    reduxLogger: false,
    persistFiles: false,
    debugOnlineIndicator: true,
    googleAnalyticsTrackingId: 'UA-26890288-4',
  },
  dev: {
    baseUrl: 'http://dev.sheltercluster.org',
    axiosExtra: {},
    deleteFilesOnLogout: true,
    reduxLogger: true,
    persistFiles: true,
    debugOnlineIndicator: true,
    googleAnalyticsTrackingId: 'UA-26890288-4',
  },
  stage: {
    baseUrl: 'http://stage.sheltercluster.org',
    axiosExtra: {},
    deleteFilesOnLogout: true,
    reduxLogger: false,
    persistFiles: true,
    debugOnlineIndicator: false,
    googleAnalyticsTrackingId: 'UA-26890288-4',
  },
  prod: {
    baseUrl: 'https://www.sheltercluster.org',
    axiosExtra: {},
    deleteFilesOnLogout: true,
    reduxLogger: false,
    persistFiles: true,
    debugOnlineIndicator: false,
    googleAnalyticsTrackingId: 'UA-26890288-3',
  }
};

config.default = config.prod;

const channel = config[Expo.Constants.manifest.releaseChannel] !== undefined
  ? Expo.Constants.manifest.releaseChannel
  // : 'local';
  // : 'dev';
  : 'dev';
  //: 'local_jm';

export default config[channel];
