// @flow

import React from 'react';
import {Linking, Share, StyleSheet, View} from 'react-native';
import type {NewsObject} from "../model/news";
import Button from "./Button";
import {ensurePermissions} from "../permission";
import * as Permissions from 'expo-permissions';
import i18n from "../i18n";

type Props = {
  news: NewsObject,
  online: boolean,
};

type State = {
  modal: string | null,
}

export default class NewsActions extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      modal: null,
    };
  }

  render() {
    const {news} = this.props;
    const buttons = [];

    buttons.push(<Button key="share" title={i18n.t("Share")} icon="share" onPress={() => {
      Share.share({url: news.url})
    }}/>);

    return <View style={styles.container}>
      {buttons}
    </View>;
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 10,
  },
  button: {
    marginTop: 10,
  },
});
