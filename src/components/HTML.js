// @flow

import React from 'react';
import * as WebBrowser from 'expo-web-browser';
import HTML from "react-native-render-html";
import {Linking} from "react-native";

export default props => <HTML
  {...props}
  onLinkPress={(event, url) => {
    if (url.startsWith('http://') || url.startsWith('https://'))
      return WebBrowser.openBrowserAsync(url);
    else
      Linking.openURL(url);
  }}
/>;
