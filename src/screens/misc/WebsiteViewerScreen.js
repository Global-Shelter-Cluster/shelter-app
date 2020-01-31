// @flow

import React from 'react';
import {WebView} from 'react-native-webview';
import NavTitleContainer from "../../containers/NavTitleContainer";
import Loading from "../../components/Loading";
import type {navigation} from "../../nav";
import {hitPage} from "../../analytics";
import i18n from "../../i18n";

type Props = {
  navigation: navigation,
}

export default class WebsiteViewerScreen extends React.Component<Props> {
  static navigationOptions = ({navigation}: { navigation: navigation }) => ({
    headerTitle: <NavTitleContainer title={navigation.getParam('title', i18n.t('Loading...'))}/>,
  });

  componentDidMount() {
    this.props.navigation.addListener(
      'didFocus',
      payload => hitPage(payload.state.routeName),
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
