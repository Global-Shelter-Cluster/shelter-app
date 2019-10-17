// @flow

import React from 'react';
import {Modal, Platform, Share, StyleSheet, TouchableOpacity, View} from 'react-native';
import {WebView} from 'react-native-webview';
import type {PublicDocumentObject} from "../model/document";
import Button from "./Button";
import {getExtension} from "../util";
import Constants from 'expo-constants';
import vars from "../vars";
import {FontAwesome} from '@expo/vector-icons';
import PDFReader from 'rn-pdf-reader-js';
import i18n from "../i18n";

type Props = {
  document: PublicDocumentObject,
  online: boolean,
};

type State = {
  modal: string | null,
}

export default class DocumentActions extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      modal: null,
    };
  }

  render() {
    const {document, online} = this.props;
    const buttons = [];
    const isLink = document.link !== undefined;

    if (isLink) {
      // It's a link
      if (online)
        buttons.push(<Button
          key="view" primary title="View"
          onPress={() => this.setState({modal: 'link'})}/>);
      else
        buttons.push(<Button key="view" disabledIcon="wifi" title={i18n.t("View")} />);
    } else {
      // It's a file
      const isLocalFile = document.file !== undefined && document.file.startsWith('file://');
      const extension = getExtension(document.file);

      if (online || isLocalFile) {
        switch (extension) {
          case '.pdf':
            if (Platform.OS === 'ios')
              buttons.push(<Button
                key="view" primary title={i18n.t("View")}
                onPress={() => this.setState({modal: 'webview'})}/>);
            else
              buttons.push(<Button
                key="view" primary title={i18n.t("View")}
                onPress={() => this.setState({modal: 'pdf'})}/>);
            break;

          default:
            // TODO: figure out what to do in this case...
            buttons.push(<Button
              key="view" primary title={i18n.t("View")}
              onPress={() => this.setState({modal: 'webview'})}/>);
        }
      } else
      // We're offline and don't have the file locally.
        buttons.push(<Button key="view" disabledIcon="wifi" title={i18n.t("View")}/>);
    }

    // if (online)
      buttons.push(<Button key="share" title={i18n.t("Share")} icon="share" onPress={() => {
        Share.share({url: document.file})
      }}/>);
    // else
    //   buttons.push(<Button key="share" disabledIcon="wifi" title="Share"/>);

    // buttons.push(<Button key="test1" primary title="View" onPress={() => {
    //   Linking.openURL(document.file)
    // }}/>);
    //
    // buttons.push(<Button key="test2" primary title="View map on iOS" onPress={() => {
    //   Linking.openURL("http://maps.apple.com/?ll=37.484847,-122.148386")
    // }}/>);
    //
    // buttons.push(<Button key="test3" primary title="View map" onPress={() => {
    //   Linking.openURL("geo:37.484847,-122.148386")
    // }}/>);

    let modal;
    switch (this.state.modal) {
      case 'link':
        modal = <WebView style={{marginTop: Constants.statusBarHeight}} source={{uri: document.link}}/>;
        break;
      case 'webview':
        modal = <WebView style={{marginTop: Constants.statusBarHeight}} source={{uri: document.file}}/>;
        break;
      case 'pdf':
        modal = <PDFReader source={{uri: document.file}}/>;
    }

    return <View style={styles.container}>
      {buttons.map((button, i) => <View key={i} style={styles.button}>{button}</View>)}
      <Modal
        animationType="slide"
        visible={this.state.modal !== null}
        onRequestClose={() => this.setState({modal: null})}
      >
        {modal}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => this.setState({modal: null})}
        >
          <FontAwesome name={"times"} size={26} color={vars.SHELTER_DARK_BLUE}/>
        </TouchableOpacity>
      </Modal>
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
