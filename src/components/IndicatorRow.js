// @flow

import React from 'react';
import {Button, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import type {bgProgressType} from "../reducers/bgProgress";
import persist from "../persist";
import config from "../config";
import {hairlineWidth} from "../util";
import vars from "../vars";
import {FontAwesome} from '@expo/vector-icons';
import Collapsible from "./Collapsible";

type Props = {
  online: boolean,
  setOnline: (boolean) => {},
  bgProgress: bgProgressType,
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
    const {online, setOnline, bgProgress} = this.props;

    let currentOperationDescription = '';
    switch (bgProgress.currentOperation) {
      case "assessment":
        currentOperationDescription = 'Submitting assessment form';
        break;
      case "file":
        currentOperationDescription = 'Downloading file';
        break;
    }

    const downloadIndicator = bgProgress.totalCount > 0
      ? <Text style={{flex: 1}}>
        {currentOperationDescription} {bgProgress.totalCount - bgProgress.operationsLeft + 1} / {bgProgress.totalCount}
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
        <ScrollView contentContainerStyle={{paddingVertical: 50}}>
          <Text style={styles.text}>
            PROGRAM/INITIATIVE/ACTIVITY UNDERTAKEN WITH THE FINANCIAL SUPPORT OF THE GOVERNMENT OF CANADA PROVIDED
            THROUGH GLOBAL AFFAIRS CANADA (GAC)
          </Text>
          <Image style={styles.logo} source={require("../../assets/about/red-cross.png")}/>
          <Image style={styles.logo} source={require("../../assets/about/gov-canada.png")}/>
          <Text style={styles.text}>
            THIS APP IS MADE POSSIBLE THROUGH THE FINANCIAL AND IN-KIND CONTRIBUTIONS OF:
          </Text>
          <Image style={styles.logo} source={require("../../assets/about/unhcr.png")}/>
          <Image style={styles.logo} source={require("../../assets/about/international-federation-of-redcross.png")}/>
          <Image style={styles.logo} source={require("../../assets/about/humanitarian-aid.png")}/>
          <View style={{height: 50}}/>
          <Collapsible title="Technical information" isOpen>
            <Text>Expo version: {Expo.Constants.expoVersion}</Text>
            <Text>App version: {Expo.Constants.manifest.version}</Text>
            <Text>Environment: {Expo.Constants.manifest.releaseChannel ? Expo.Constants.manifest.releaseChannel : '<none>'}</Text>
            <Text>Connectivity: {onlineIndicator}</Text>
          </Collapsible>
        </ScrollView>
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
  text: {
    color: vars.SHELTER_GREY,
    marginVertical: 30,
    marginHorizontal: 20,
    textAlign: "center",
  },
  logo: {
    alignSelf: "center",
    marginVertical: 20,
    maxWidth: "90%",
    resizeMode: "contain",
    // height: "auto",
  },
});
