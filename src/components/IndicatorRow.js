// @flow

import React from 'react';
import {Button, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import type {downloadProgressType} from "../reducers/downloadProgress";
import persist from "../persist";
import config from "../config";
import {hairlineWidth} from "../util";
import vars from "../vars";
import {FontAwesome} from '@expo/vector-icons';

type Props = {
  online: boolean,
  setOnline: (boolean) => {},
  downloadProgress: downloadProgressType,
};

type State = {
  isModalOpen: boolean,
}

export default class IndicatorRow extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isModalOpen: false,
    };
  }

  render() {
    const {online, setOnline, downloadProgress} = this.props;

    const downloadIndicator = downloadProgress.downloadingCount > 0
      ? <Text style={{flex: 1}}>
        Downloading {downloadProgress.downloadingCount - downloadProgress.filesLeft.length + 1} / {downloadProgress.downloadingCount}
      </Text>
      : null;

    const onlineIndicator = config.debugOnlineIndicator
      ? <Text
        onPress={() => setOnline(!online)}
        onLongPress={() => persist.clearAll(true)}
      >{online ? 'online' : 'offline'}</Text>
      : <Text>{online ? 'online' : 'offline'}</Text>;

    return <View style={{
      flexDirection: 'row',
      justifyContent: "space-evenly",
      width: "100%",
      alignItems: "center",
      padding: 10,
      borderColor: vars.LIGHT_GREY,
      borderTopWidth: hairlineWidth,
    }}>
      {downloadIndicator}
      <TouchableOpacity onPress={() => this.setState({isModalOpen: true})} style={{flex: 1, alignItems: "flex-end"}}>
        <FontAwesome name="info-circle" size={18} color={vars.SHELTER_GREY}/>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        visible={this.state.isModalOpen}
        onRequestClose={() => this.setState({isModalOpen: false})}
      >
        <View style={{paddingHorizontal: 30, paddingVertical: 50}}>
          <Text style={{fontWeight: "bold"}}>Shelter Cluster mobile app</Text>
          <Text>Expo version: {Expo.Constants.expoVersion}</Text>
          <Text>App version: {Expo.Constants.manifest.version}</Text>
          <Text>Environment: {Expo.Constants.manifest.releaseChannel ? Expo.Constants.manifest.releaseChannel : '<none>'}</Text>
          <Text>Connectivity: {onlineIndicator}</Text>
        </View>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => this.setState({isModalOpen: false})}
        >
          <FontAwesome name={"times"} size={26} color={vars.SHELTER_DARK_BLUE}/>
        </TouchableOpacity>
      </Modal>
    </View>;
  }
};

const styles = StyleSheet.create({
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
