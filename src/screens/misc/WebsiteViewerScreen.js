// @flow

import React from 'react';
import {FontAwesome} from '@expo/vector-icons';
import {Text, WebView} from 'react-native';
import NavTitleContainer from "../../containers/NavTitleContainer";

type Props = {
  navigation: { setParams: ({}) => {} },
}

class WebsiteViewerScreen extends React.Component<Props> {
  static navigationOptions = ({navigation}) => ({
    headerTitle: <NavTitleContainer title={navigation.getParam('title', 'Loading...')}/>,
  });

  render() {
    const url = this.props.navigation.getParam('url', null);

    if (url)
      return <WebView source={{uri: url}}/>;
    else
      return <Text>Loading...</Text>;
  }
}

export default WebsiteViewerScreen;
