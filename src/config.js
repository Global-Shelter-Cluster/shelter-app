// @flow

export type configType = {
  baseUrl: string,
  axiosExtra: {},
  deleteFilesOnLogout: boolean,
  reduxLogger: boolean,
  persistFiles: boolean,
  debugOnlineIndicator: boolean, // allows toggling online/offline and clearing cache with a "long press" on the indicator
};

const config: { [string]: configType } = {
  local: {
    baseUrl: 'http://local.sheltercluster.org.192.168.0.11.xip.io',
    axiosExtra: {},
    deleteFilesOnLogout: false,
    reduxLogger: true,
    persistFiles: false,
    debugOnlineIndicator: true,
  },
  local_jm: {
    baseUrl: 'http://192.168.0.101:32776',
    axiosExtra: {},
    deleteFilesOnLogout: false,
    reduxLogger: true,
    persistFiles: false,
  },
  dev: {
    baseUrl: 'http://dev.sheltercluster.org',
    axiosExtra: {},
    deleteFilesOnLogout: false,
    reduxLogger: true,
    persistFiles: true,
    debugOnlineIndicator: false,
  },
  stage: {
    baseUrl: 'http://stage.sheltercluster.org',
    axiosExtra: {auth: {username: "shelter", password: "cluster"}},
    deleteFilesOnLogout: true,
    reduxLogger: false,
    persistFiles: true,
    debugOnlineIndicator: false,
  },
  prod: {
    baseUrl: 'https://www.sheltercluster.org',
    axiosExtra: {},
    deleteFilesOnLogout: true,
    reduxLogger: false,
    persistFiles: true,
    debugOnlineIndicator: false,
  }
};

const channel = config[Expo.Constants.manifest.releaseChannel] !== undefined
  ? Expo.Constants.manifest.releaseChannel
  // : 'local';
  // : 'dev';
  : 'local_jm';

export default config[channel];
