// @flow

import React from 'react';
import {Image, Modal, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Constants} from "expo";
import vars from "../vars";
import {FontAwesome} from '@expo/vector-icons';
import FitImage from 'react-native-fit-image';

type Props = {
  online: boolean,
  full: string,
  source: { uri: string },
};

type State = {
  isOpen: boolean,
}

export default class ExpandableFitImage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  render() {
    const {full, online, source} = this.props;

    if (!online || !full)
      return <FitImage source={source}/>;

    return <View>
      <TouchableOpacity onPress={() => this.setState({isOpen: true})}>
        <FitImage source={source}/>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        visible={this.state.isOpen}
        onRequestClose={() => this.setState({isOpen: false})}
      >
        <ScrollView
          maximumZoomScale={5} minimumZoomScale={1}
          style={{marginTop: Constants.statusBarHeight}}
        >
          <FitImage source={{uri: full}}/>
        </ScrollView>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => this.setState({isOpen: false})}
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
