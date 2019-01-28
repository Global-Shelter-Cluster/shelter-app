// @flow

import React from 'react';
import {Animated, Button, Image, Modal, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import t from 'tcomb-form-native';
import {Constants, FileSystem, ImageManipulator, Location, MapView} from 'expo';
import {FontAwesome} from '@expo/vector-icons';
import vars from "../../vars";

type Region = {
  latitude: number,
  longitude: number,
  latitudeDelta: number,
  longitudeDelta: number,
};

type Props = {
  title: string
};

type State = {
  region?: Region,
  lat: number,
  lon: number,
  modal: boolean,
  modalCounter: number, // just increment this when you want the modal map to update
};

const Component = t.form.Component;

class GeolocationFactory extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      region: undefined,
      lat: undefined,
      lon: undefined,
      modal: false,
      modalCounter: 0,
    };
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return true;
  }

  _setLocation = async (lat: number, lon: number, optionalRegion: Region | null = null, incrementModalCounter: boolean = false) => {
    const newState = {lat, lon};
    if (optionalRegion)
      newState.region = optionalRegion;
    if (incrementModalCounter)
      newState.modalCounter = this.state.modalCounter + 1;
    this.setState(newState);

    super.getLocals().onChange({lat, lon});
  };

  _setCurrentLocation = async (incrementModalCounter: boolean = false) => {
    const location = await Location.getCurrentPositionAsync();//{accuracy: Location.Accuracy.High});
    this._setLocation(location.coords.latitude, location.coords.longitude, {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.000922 * 2,
      longitudeDelta: 0.000421 * 2,
    }, incrementModalCounter);
  };

  getTemplate() {
    return (locals: Object) => {
      const stylesheet = locals.stylesheet;
      let topContainer = styles.topContainer;
      let container = styles.container;

      const hasData = this.state.lat !== undefined && this.state.lon !== undefined;
      const lat = this.state.lat ? this.state.lat : 0;
      const lon = this.state.lon ? this.state.lon : 0;
      const region: Region = this.state.region ? this.state.region : {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 1,
        longitudeDelta: 1,
      };

      const modal = <MapView
        key={"modal-map-" + this.state.modalCounter}
        style={{marginTop: Constants.statusBarHeight, flex: 1}}

        showsIndoors={false}
        showsTraffic={false}

        showsMyLocationButton={false}
        showsUserLocation

        initialRegion={region}

        onPress={({coordinate}) => this._setLocation(coordinate.latitude, coordinate.longitude)}
      >
        <MapView.Marker coordinate={{latitude: lat, longitude: lon}}/>
      </MapView>;

      return (
        <View>
          {locals.label
            ? <Text
              style={[
                locals.hasError ? stylesheet.controlLabel.error : stylesheet.controlLabel.normal,
                locals.error ? {color: '#a94442'} : {}
              ]}>
              {locals.label}
            </Text>
            : null
          }
          <View
            style={[
              topContainer,
              locals.hasError ? {borderColor: '#a94442'} : {}
            ]}>
            <MapView
              style={{flex: 1}}

              rotateEnabled={false}
              scrollEnabled={false}
              pitchEnabled={false}
              toolbarEnabled={false}
              zoomEnabled={false}
              zoomControlEnabled={false}

              showsIndoors={false}
              showsTraffic={false}

              showsMyLocationButton={false}

              region={region}
            >
              {hasData ? <MapView.Marker coordinate={{latitude: lat, longitude: lon}}/> : null}
            </MapView>
          </View>
          <View style={styles.buttonContainer}>
            {locals.help || locals.config.help ? (
              <Text style={[
                locals.hasError ? stylesheet.helpBlock.error : stylesheet.helpBlock.normal,
                {paddingVertical: 10, flex: 1},
              ]}>
                {locals.help || locals.config.help}
              </Text>
            ) : null}

            {this.state.lat && this.state.lon
              ? <TouchableOpacity
                style={styles.button}
                onPress={() => this.setState({
                  lat: undefined,
                  lon: undefined,
                })}>
                <FontAwesome name="times" size={24} color={vars.SHELTER_GREY} style={styles.icon}/>
              </TouchableOpacity>
              : null
            }

            <TouchableOpacity
              style={styles.button}
              onPress={this._setCurrentLocation}>
              <FontAwesome name="location-arrow" size={24} color={vars.SHELTER_GREY} style={styles.icon}/>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => this.setState({modal: true})}>
              <FontAwesome name="crosshairs" size={24} color={vars.SHELTER_GREY} style={styles.icon}/>
            </TouchableOpacity>
          </View>
          {this.state.modal
            ? <Modal
              animationType="slide"
              visible={this.state.modal !== null}
              onRequestClose={() => this.setState({modal: false})}
            >
              {modal}
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalSmallButton}
                  onPress={() => this._setCurrentLocation(true)} // move the map (through its "initialRegion" prop) by creating a new one (through its "key" prop)
                >
                  <FontAwesome name={"location-arrow"} size={20} color={vars.SHELTER_DARK_BLUE}/>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, {backgroundColor: vars.SHELTER_RED}]}
                  onPress={() => this.setState({modal: false})}
                >
                  <FontAwesome name={"crosshairs"} size={26} color={vars.BG_GREY}/>
                </TouchableOpacity>
              </View>
            </Modal>
            : null
          }
        </View>
      );
    };
  }
}

const styles = StyleSheet.create({
  topContainer: {
    overflow: 'hidden',
    borderRadius: 2,
    height: 150,
    borderColor: vars.SHELTER_GREY,
    borderWidth: 1
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    borderRadius: 2
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  icon: {
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  image: {
    height: 150
  },
  modalButtons: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    alignItems: "center",
  },
  modalButton: {
    marginTop: 20,
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
  modalSmallButton: {
    marginTop: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: vars.SHELTER_LIGHT_BLUE,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 3,
    shadowOpacity: .5,
    elevation: 3, // Shadow works for iOS, elevation for Android
  },
});

export default GeolocationFactory;
