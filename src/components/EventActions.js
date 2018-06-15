// @flow

import React from 'react';
import {Linking, Modal, Platform, Share, StyleSheet, TouchableOpacity, View, WebView} from 'react-native';
import type {PublicEventObject} from "../model/event";
import Button from "./Button";
import {Constants, MapView} from "expo";
import vars from "../vars";
import {FontAwesome} from '@expo/vector-icons';
import {Marker} from "react-native-maps";
import moment from "moment/moment";

type Props = {
  event: PublicEventObject,
  online: boolean,
};

type State = {
  modal: string | null,
}

export default class EventActions extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      modal: null,
    };
  }

  render() {
    const {event, online} = this.props;
    const buttons = [];
    const hasGeolocation = event.geo !== undefined && event.geo.lat && event.geo.lon;

    if (hasGeolocation) {
      // It's a link
      if (online)
        buttons.push(<Button
          key="map" primary title="Map"
          onPress={() => this.setState({modal: 'map'})}/>);
      else
        buttons.push(<Button key="map" disabledIcon="wifi" title="Map"/>);
    }

    // if (online)
    //   buttons.push(<Button key="share" title="Share" icon="share" onPress={() => {
    //     Share.share({url: event.file})
    //   }}/>);
    // else
    //   buttons.push(<Button key="share" disabledIcon="wifi" title="Share"/>);

    let modal;
    switch (this.state.modal) {
      case 'map':
        modal = <MapView
          style={{marginTop: Constants.statusBarHeight, flex: 1,}}
          initialRegion={{
            latitude: event.geo.lat,
            longitude: event.geo.lon,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <Marker
            coordinate={{latitude: event.geo.lat, longitude: event.geo.lon}}
            title={event.title}
            description={moment(event.date).format('D MMM YYYY, h:mm a')}
          />
        </MapView>;
        break;
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
