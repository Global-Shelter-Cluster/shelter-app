const config = {
  // no trailing slash on baseUrl
  // baseUrl: 'https://www.sheltercluster.org', //prod
  baseUrl: 'http://dev.sheltercluster.org', //dev
  axiosExtra: {auth: {username: "shelter", password: "cluster"}},
  // baseUrl: 'http://local.sheltercluster.org.192.168.0.11.xip.io', //local
};

export default config;
