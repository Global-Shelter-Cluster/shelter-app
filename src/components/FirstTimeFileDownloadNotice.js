// @flow

import React from "react";
import {Html, Image, StyleSheet, Text, View} from "react-native";
import {FontAwesome} from '@expo/vector-icons';
import vars from "../vars";
import Button from "./Button";
import prettyBytes from 'pretty-bytes';
import i18n from "../i18n";
import HTML from './HTML';

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

    let message;

    if (bytes) {
      const replacements = {'@bytes': prettyBytes(bytes, {locale: i18n.currentLanguage})};
      message = files === 1
        ? i18n.t("In order for the app to work while offline, we need to download <b>1 file</b> (approximately <b>@bytes</b>). You can turn file downloads on/off in Settings.", null, replacements)
        : i18n.t("In order for the app to work while offline, we need to download <b>@count files</b> (approximately <b>@bytes</b>). You can turn file downloads on/off in Settings.", files, replacements);
    } else {
      message = files === 1
        ? i18n.t("In order for the app to work while offline, we need to download <b>1 file</b>. You can turn file downloads on/off in Settings.")
        : i18n.t("In order for the app to work while offline, we need to download <b>@count files</b>. You can turn file downloads on/off in Settings.", files);
    }

    const downloadLabel = i18n.t("Download");
    const skipLabel = i18n.t("Skip for now");

    // Some languages have long labels, which makes the buttons don't show them fully when they're side-to-side. Instead,
    // we show them one on top of the other.
    const longLabels = downloadLabel.length > 14 || skipLabel.length > 14;

    return <View style={styles.container}>
      <HTML baseFontStyle={styles.label} html={message}/>
      <View style={longLabels ? styles.buttonContainerLongLabels : styles.buttonContainer}>
        <Button
          style={longLabels ? styles.buttonLongLabel : styles.button} primary
          onPress={ok} title={downloadLabel}
        />
        <Button
          style={longLabels ? styles.buttonLongLabel : styles.button}
          onPress={cancel} title={skipLabel}
        />
      </View>
    </View>;
  }
}

const styles = StyleSheet.create({
  container: {
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
  buttonContainerLongLabels: {
    marginVertical: 10,
    marginHorizontal: 0,
  },
  buttonLongLabel: {
    flex: 1,
  },
});
