/* @flow */

/**
 * Heavily adapted from: https://raw.githubusercontent.com/InterfaceKit/react-native-image-picker-form/master/lib/ImageFactory.js
 */

import React from 'react';
import {Animated, Button, Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import t from 'tcomb-form-native';
import {FontAwesome} from '@expo/vector-icons';
import vars from "../../vars";

type Props = {
  title: string
};
type State = {
  image: ?string
};

const Component = t.form.Component;

class ImageFieldFactory extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      image: undefined,
      height: new Animated.Value(0),
      overflow: 'visible'
    };
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return true;
  }

  _startAnimation = () => {
    Animated.sequence([
      Animated.timing(this.state.height, {
        toValue: 0,
        duration: 250
      }),
      Animated.timing(this.state.height, {
        toValue: 150,
        duration: 500,
        delay: 75
      })
    ]).start();
  };

  _resizeImage = (path: string) => {
    return new Promise(function (resolve, reject) {
      Image.getSize(path, async (width, height) => {
        const resizeTo = 1024; // pixels
        const jpegCompression = .7;

        // Find which resize operation to perform, if any.
        // For example, for a 6000x1000 image, we should resize to 1024 of width; for a 1000x6000 image, 1024 of height;
        // and for a 800x600 image we shouldn't resize at all (though we still do the jpeg compression).
        const tempW = width - Math.min(resizeTo, width);
        const tempH = height - Math.min(resizeTo, height);
        const ops = [];
        if (tempW > tempH && tempW > 0)
          // resize based on width
          ops.push({resize: {width: resizeTo}});
        else if (tempH > 0)
          // resize based on height
          ops.push({resize: {height: resizeTo}});

        const {uri} = await Expo.ImageManipulator.manipulate(path, ops, {
          compress: jpegCompression,
          format: 'jpeg',
        });

        resolve(uri);
      }, () => reject());
    });
  };

  _getImageFromStorage = async (path: string) => {
    path = await this._resizeImage(path);

    const next = this.state.image ? null : () => this._startAnimation();
    this.setState({image: path, overflow: 'hidden'}, next);
    super.getLocals().onChange(path);
  };

  getTemplate() {
    return (locals: Object) => {
      const stylesheet = locals.stylesheet;
      let controlLabelStyle = stylesheet.controlLabel.normal;
      let helpBlockStyle = stylesheet.helpBlock.normal;
      let topContainer = stylesheet.imagePicker
        ? stylesheet.imagePicker.topContainer
        : styles.topContainer;
      let container = stylesheet.imagePicker
        ? stylesheet.imagePicker.container
        : styles.container;

      if (locals.hasError) {
        controlLabelStyle = stylesheet.controlLabel.error;
        helpBlockStyle = stylesheet.helpBlock.error;
      }

      return (
        <View>
          {locals.label ? (
            <Text
              style={[
                controlLabelStyle,
                locals.error ? {color: '#a94442'} : {}
              ]}>
              {locals.label}
            </Text>
          ) : null}
          <View
            style={[
              topContainer,
              locals.hasError ? {borderColor: '#a94442'} : {}
            ]}>
            {this.state.image
              ? <Animated.Image
                resizeMode="cover"
                source={{
                  uri: this.state.image
                }}
                style={[styles.image, {height: this.state.height}]}
              />
              : null
            }
            <View
              style={[
                {overflow: this.state.overflow},
                container,
                locals.hasError ? {backgroundColor: '#E28E8E'} : {}
              ]}>
              <FontAwesome name={"picture-o"} size={90} color={vars.VERY_LIGHT_GREY} style={styles.icon}/>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            {locals.help || locals.config.help ? (
              <Text style={[helpBlockStyle, {paddingVertical: 10, flex: 1}]}>
                {locals.help || locals.config.help}
              </Text>
            ) : null}

            {this.state.image
              ? <TouchableOpacity
                style={styles.button}
                onPress={() => this.setState({
                  image: undefined,
                  height: new Animated.Value(0),
                  overflow: 'visible'
                })}>
                <FontAwesome name="times" size={24} color={vars.SHELTER_GREY} style={styles.icon}/>
              </TouchableOpacity>
              : null
            }

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                Expo.ImagePicker.launchCameraAsync({mediaTypes: "Images"}).then((image: Object) => {
                  if (image.cancelled)
                    return;
                  this._getImageFromStorage(image.uri)
                })}>
              <FontAwesome name="camera" size={24} color={vars.SHELTER_GREY} style={styles.icon}/>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                Expo.ImagePicker.launchImageLibraryAsync({mediaTypes: "Images"}).then((image: Object) => {
                  if (image.cancelled)
                    return;
                  this._getImageFromStorage(image.uri)
                })}>
              <FontAwesome name="file-image-o" size={24} color={vars.SHELTER_GREY} style={styles.icon}/>
            </TouchableOpacity>
          </View>
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
    borderColor: 'grey',
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
  }
});

export default ImageFieldFactory;
