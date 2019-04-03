// @flow

import React from "react";
import {Image, StyleSheet, Text, View, Html} from "react-native";
import {FontAwesome} from '@expo/vector-icons';
import vars from "../vars";
import Button from "./Button";
import prettyBytes from 'pretty-bytes';
import i18n from "../i18n";
import HTML from 'react-native-render-html';
import TranslatedText from "./TranslatedText"

type Props = {
  online: boolean,
  alreadyAsked: boolean,
  files: number,
  getBytes: () => void,
  ok: () => void,
  cancel: () => void,
};

type State = {
  bytes: number,
}

export default class FirstTimeFileDownloadNotice extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      bytes: 0,
    };
  }

  async componentWillReceiveProps(nextProps) {
    if (this.props.files === nextProps.files)
      return;

    const bytes = await nextProps.getBytes();
    this.setState({bytes});
  }

  render() {
    const {online, alreadyAsked, files, ok, cancel} = this.props;
    const {bytes} = this.state;

    if (alreadyAsked || !online || !files)
      return null;

    const byteString = bytes ? i18n.t("(approximately <b>@bytes</b>)", null, {'@bytes': prettyBytes(bytes, {locale: 'en'})}) : null;

    const filesMessage = files === 1
      ? i18n.t("In order for the app to work while offline, we need to download <b>1 file</b>.")
      : i18n.t("In order for the app to work while offline, we need to download <b>@count files</b>.", files);

    const message = byteString ? filesMessage + ' ' + byteString : filesMessage;

    return <View style={styles.container}>
      <HTML baseFontStyle={styles.label} html={message} />
      <TranslatedText style={styles.label}>You can turn file downloads on/off in Settings.</TranslatedText>
      <View style={styles.buttonContainer}>
        <Button
          style={styles.button} primary
          onPress={ok} title={i18n.t("Download")}
        />
        <Button
          style={styles.button}
          onPress={cancel} title={i18n.t("Skip for now")}
        />
      </View>
    </View>;
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: vars.ACCENT_DARK_BLUE,
    marginBottom: 10,
  },
  label: {
    color: vars.WHITE_SEMITRANSPARENT,
    fontSize: 16,
  },
  bold: {
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 10,
    marginHorizontal: -10,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
  },
});
