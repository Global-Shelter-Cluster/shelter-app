export type configType = {
  baseUrl: string,
  axiosExtra: {},
  deleteFilesOnLogout: boolean,
};

const config: { [string]: configType } = {
  local: {
    baseUrl: 'http://local.sheltercluster.org.192.168.0.11.xip.io',
    axiosExtra: {},
    deleteFilesOnLogout: false,
  },
  dev: {
    baseUrl: 'http://dev.sheltercluster.org',
    axiosExtra: {},
    deleteFilesOnLogout: false,
  },
  stage: {
    baseUrl: 'http://stage.sheltercluster.org',
    axiosExtra: {auth: {username: "shelter", password: "cluster"}},
    deleteFilesOnLogout: true,
  },
  prod: {
    baseUrl: 'https://www.sheltercluster.org',
    axiosExtra: {},
    deleteFilesOnLogout: true,
  }
};

const channel = config[Expo.Constants.manifest.releaseChannel] !== undefined
  ? Expo.Constants.manifest.releaseChannel
  // : 'local';
  : 'dev';

export default config[channel];
