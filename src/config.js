export type configType = {
  baseUrl: string,
  axiosExtra: {},
  deleteFilesOnLogout: boolean,
  reduxLogger: boolean,
};

const config: { [string]: configType } = {
  local: {
    baseUrl: 'http://local.sheltercluster.org.192.168.0.11.xip.io',
    axiosExtra: {},
    deleteFilesOnLogout: false,
    reduxLogger: true,
  },
  dev: {
    baseUrl: 'http://dev.sheltercluster.org',
    axiosExtra: {},
    deleteFilesOnLogout: false,
    reduxLogger: true,
  },
  stage: {
    baseUrl: 'http://stage.sheltercluster.org',
    axiosExtra: {auth: {username: "shelter", password: "cluster"}},
    deleteFilesOnLogout: true,
    reduxLogger: false,
  },
  prod: {
    baseUrl: 'https://www.sheltercluster.org',
    axiosExtra: {},
    deleteFilesOnLogout: true,
    reduxLogger: false,
  }
};

const channel = config[Expo.Constants.manifest.releaseChannel] !== undefined
  ? Expo.Constants.manifest.releaseChannel
  // : 'local';
  : 'dev';

export default config[channel];
