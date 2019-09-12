// @flow

import React from 'react';
import {
  Animated,
  Button,
  Easing,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import type {bgProgressType} from "../reducers/bgProgress";
import persist from "../persist";
import config from "../config";
import {hairlineWidth} from "../util";
import vars from "../vars";
import {FontAwesome} from '@expo/vector-icons';
import Collapsible from "./Collapsible";
import SingleLineText from "./SingleLineText";
import i18n from "../i18n";
import TranslatedText from "./TranslatedText"
import Constants from 'expo-constants';

type Props = {
  online: boolean,
  setOnline: (boolean) => {},
  bgProgress: bgProgressType,
  fileDownloadsDisabled: boolean,
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
    const {online, setOnline, bgProgress, fileDownloadsDisabled} = this.props;

    let currentOperationDescription = '';
    if (online) {
      switch (bgProgress.currentOperation) {
        case "assessment":
          currentOperationDescription = 'Submitting form';
          break;
        case "file":
          currentOperationDescription = 'Downloading file';
          break;
      }
      currentOperationDescription = (bgProgress.totalCount - bgProgress.operationsLeft + 1) + ' / ' + bgProgress.totalCount + ': ' + currentOperationDescription;
    } else
      currentOperationDescription = 'Offline';

    const loadingIcon = online && bgProgress.totalCount > 0
      ? <RotatingLoadingIcon/>
      : null;

    // Hide the indicator if there's only file downloads left and these are turned off
    const hideProgressIndicator = (fileDownloadsDisabled && bgProgress.totalCount > 0 && bgProgress.operationsLeft === bgProgress.filesLeft.length)

    const progressIndicator = !hideProgressIndicator && bgProgress.totalCount > 0
      ? <View style={{flexDirection: "row", padding: 10, flex: 1}}>
        {loadingIcon}
        <SingleLineText>{currentOperationDescription}</SingleLineText>
      </View>
      : null;

    const onlineIndicator = config.debugMode
      ? <TranslatedText
        onPress={() => setOnline(!online)}
        onLongPress={() => persist.clearAll(true)}
      >{online ? 'online' : 'offline'}</TranslatedText>
      : <TranslatedText>{online ? 'online' : 'offline'}</TranslatedText>;

    return <View style={{
      flexDirection: 'row',
      // justifyContent: "space-evenly",
      justifyContent: "flex-end",
      width: "100%",
      alignItems: "flex-end",
      // padding: 10,
      borderColor: vars.LIGHT_GREY,
      borderTopWidth: hairlineWidth,
    }}>
      {progressIndicator}
      <TouchableOpacity onPress={() => this.setState({isModalOpen: true})} style={{padding: 10}}>
        <FontAwesome name="info-circle" size={18} color={vars.SHELTER_GREY}/>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        visible={this.state.isModalOpen}
        onRequestClose={() => this.setState({isModalOpen: false})}
      >
        <ScrollView contentContainerStyle={{paddingVertical: 50}}>
          <TranslatedText style={styles.text}>
            PROGRAM/INITIATIVE/ACTIVITY UNDERTAKEN WITH THE FINANCIAL SUPPORT OF THE GOVERNMENT OF CANADA PROVIDED
            THROUGH GLOBAL AFFAIRS CANADA (GAC)
          </TranslatedText>
          <Image style={styles.logo} source={require("../../assets/about/red-cross.png")}/>
          <Image style={styles.logo} source={require("../../assets/about/gov-canada.png")}/>
          <TranslatedText style={styles.text}>
            THIS APP IS MADE POSSIBLE THROUGH THE FINANCIAL AND IN-KIND CONTRIBUTIONS OF:
          </TranslatedText>
          <Image style={styles.logo} source={require("../../assets/about/unhcr.png")}/>
          <Image style={styles.logo} source={require("../../assets/about/international-federation-of-redcross.png")}/>
          <Image style={styles.logo} source={require("../../assets/about/humanitarian-aid.png")}/>
          <View style={{height: 50}}/>
          <Collapsible title={i18n.t("Technical information")} isOpen>
            <TranslatedText replacements={{'@version': Constants.expoVersion}}>Expo version: @version</TranslatedText>
            <TranslatedText replacements={{'@version': Constants.manifest.version}}>App version: @version</TranslatedText>
            <TranslatedText
              replacements={{'@env': Constants.manifest.releaseChannel ? Constants.manifest.releaseChannel : i18n.t('<none>') }}
            >Environment: @env
            </TranslatedText>
            <Text>
              <TranslatedText>Connectivity</TranslatedText>: {onlineIndicator}
            </Text>
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

/**
 * We have a separate component for the "loading" icon with shouldComponentUpdate always returning "false", which
 * prevents the animation from resetting to "rotation = 0 degree" every time the main component is rendered.
 */
class RotatingLoadingIcon extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const spinValue = new Animated.Value(0);

    Animated.loop(Animated.timing(spinValue, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: true,
    })).start();

    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return <Animated.View style={{transform: [{rotate: spin}], marginRight: 5}}>
      <FontAwesome name={"refresh"} size={16} color={vars.SHELTER_GREY}/>
    </Animated.View>;
  }
}

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
