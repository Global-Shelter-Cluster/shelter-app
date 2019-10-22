// @flow

import React from 'react';
import * as WebBrowser from 'expo-web-browser';
import HTML from "react-native-render-html";

export default props => <HTML
  {...props}
  onLinkPress={(event, url) => WebBrowser.openBrowserAsync(url)}
/>;
