// @flow

import React from 'react';
import {StyleSheet, View} from 'react-native';
import Button from "./Button";
import vars from "../vars";
import i18n from "../i18n";
import type {PublicPageObject} from "../model/page";
import type {EventDescription} from "../analytics";

type Props = {
  page: PublicPageObject,
  online: boolean,
  viewOnWebsite: () => {},
};

type State = {
  modal: string | null,
}

export default class PageActions extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      modal: null,
    };
  }

  render() {
    const {page, online, viewOnWebsite} = this.props;
    const buttons = [];
    const eventBase: EventDescription = {
      category: 'page',
      label: page.id + ': ' + page.title + ' (' + page.type + ')',
    };

    if (online)
      buttons.push(<Button
        key="view" title={i18n.t("Website")}
        icon="external-link"
        event={Object.assign({action: 'view on website'}, eventBase)}
        onPress={viewOnWebsite}/>);
    else
      buttons.push(<Button key="view" disabledIcon="wifi" title={i18n.t("Website")}/>);

    return <View style={styles.container}>
      {buttons.map((button, i) => <View key={i} style={styles.button}>{button}</View>)}
    </View>;
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingRight: 10,
    paddingBottom: 10,
  },
  button: {
    flex: 1,
    marginLeft: 10,
  },
  closeButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: vars.SHELTER_LIGHT_BLUE,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 5,
    shadowOpacity: .5,
    elevation: 5, // Shadow works for iOS, elevation for Android
  },
});
