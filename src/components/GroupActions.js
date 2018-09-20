// @flow

import React from 'react';
import {Linking, Modal, Platform, Share, StyleSheet, TouchableOpacity, View, WebView} from 'react-native';
import type {PublicGroupObject} from "../model/group";
import Button from "./Button";
import {Constants} from "expo";
import vars from "../vars";
import {FontAwesome} from '@expo/vector-icons';

type Props = {
  group: PublicGroupObject,
  online: boolean,
  changingFollowing: boolean,
  isFollowing: boolean,
  cantFollow: boolean,
  viewOnWebsite: () => {},
  follow: () => {},
  unfollow: () => {},
};

type State = {
  modal: string | null,
}

export default class GroupActions extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      modal: null,
    };
  }

  render() {
    const {group, online, changingFollowing, isFollowing, cantFollow, viewOnWebsite, follow, unfollow} = this.props;

    const buttons = [];

    if (changingFollowing)
      buttons.push(<Button key="follow" disabledIcon="refresh" title="Loading..."/>);
    else if (isFollowing)
      buttons.push(<Button
        key="follow" primary title="Un-follow"
        icon="sign-out"
        onPress={unfollow}/>);
    else if (cantFollow)
      buttons.push(<Button key="follow" disabledIcon="ban" title="Follow"/>);
    else
      buttons.push(<Button
        key="follow" primary title="Follow"
        icon="sign-in"
        onPress={follow}/>);

    if (online)
      buttons.push(<Button
        key="view" title="Website"
        icon="external-link"
        onPress={viewOnWebsite}/>);
    else
      buttons.push(<Button key="view" disabledIcon="wifi" title="Website"/>);

    return <View style={styles.container}>
      {buttons.map((button, i) => <View key={i} style={styles.button}>{button}</View>)}
      {/*<Modal
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
      </Modal>*/}
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
