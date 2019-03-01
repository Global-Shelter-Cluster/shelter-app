// @flow

import React from "react";
import {Image, StyleSheet, Text, View} from "react-native";
import {FontAwesome} from '@expo/vector-icons';
import vars from "../vars";
import Button from "./Button";
import prettyBytes from 'pretty-bytes';

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

    const byteString = bytes ? <Text>(approximately <Text style={styles.bold}>{prettyBytes(bytes, {locale: 'en'})}</Text>). </Text> : null;

    return <View style={styles.container}>
      <Text style={styles.label}>
        In order for the app to work while offline, we need to download
        <Text style={styles.bold}> {files === 1 ? "1 file" : files + " files"}{byteString ? " " : ". "}</Text>
        {byteString}
        You can turn file downloads on/off in Settings.
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          style={styles.button} primary
          onPress={ok} title="Download"
        />
        <Button
          style={styles.button}
          onPress={cancel} title="Skip for now"
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
