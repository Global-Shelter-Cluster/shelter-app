// @flow

import React from 'react';
import {FontAwesome} from '@expo/vector-icons';
import {Text, WebView} from 'react-native';
import NavTitleContainer from "../../containers/NavTitleContainer";
import Loading from "../../components/Loading";
import type {navigation} from "../../nav";
import analytics from "../../analytics";
import {PageHit} from "expo-analytics";

type Props = {
  navigation: navigation,
}

export default class WebsiteViewerScreen extends React.Component<Props> {
  static navigationOptions = ({navigation}: { navigation: navigation }) => ({
    headerTitle: <NavTitleContainer title={navigation.getParam('title', 'Loading...')}/>,
  });

  componentDidMount() {
    this.props.navigation.addListener(
      'didFocus',
      payload => analytics.hit(new PageHit(payload.state.routeName)),
    );
  }

  render() {
    const url = this.props.navigation.getParam('url', null);

    if (url)
      return <WebView source={{uri: url}}/>;
    else
      return <Loading/>;
  }
}
