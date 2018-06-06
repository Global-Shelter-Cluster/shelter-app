const config = {
  local: {
    baseUrl: 'http://local.sheltercluster.org.192.168.0.11.xip.io',
    axiosExtra: {},
  },
  dev: {
    baseUrl: 'http://dev.sheltercluster.org',
    axiosExtra: {},
  },
  stage: {
    baseUrl: 'http://stage.sheltercluster.org',
    axiosExtra: {auth: {username: "shelter", password: "cluster"}},
  },
  prod: {
    baseUrl: 'https://www.sheltercluster.org',
    axiosExtra: {},
  }
};

const channel = config[Expo.Constants.manifest.releaseChannel]
  ? Expo.Constants.manifest.releaseChannel
  : 'local';

export default config[channel];
