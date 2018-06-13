// @flow

export type configType = {
  baseUrl: string,
  axiosExtra: {},
  deleteFilesOnLogout: boolean,
  reduxLogger: boolean,
  persistFiles: boolean,
};

const config: { [string]: configType } = {
  local: {
    baseUrl: 'http://local.sheltercluster.org.192.168.0.11.xip.io',
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
  },
  stage: {
    baseUrl: 'http://stage.sheltercluster.org',
    axiosExtra: {auth: {username: "shelter", password: "cluster"}},
    deleteFilesOnLogout: true,
    reduxLogger: false,
    persistFiles: true,
  },
  prod: {
    baseUrl: 'https://www.sheltercluster.org',
    axiosExtra: {},
    deleteFilesOnLogout: true,
    reduxLogger: false,
    persistFiles: true,
  }
};

const channel = config[Expo.Constants.manifest.releaseChannel] !== undefined
  ? Expo.Constants.manifest.releaseChannel
  // : 'local';
  : 'dev';

export default config[channel];
