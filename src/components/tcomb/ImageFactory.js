/* @flow */

/**
 * Heavily adapted from: https://raw.githubusercontent.com/InterfaceKit/react-native-image-picker-form/master/lib/ImageFactory.js
 */

import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import t from 'tcomb-form-native';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import {FontAwesome} from '@expo/vector-icons';
import vars from "../../vars";
import persist from "../../persist";

const DIR = 'image-field';

type Props = {
  title: string,
  value?: string,
};

type State = {
  value?: string,
};

const Component = t.form.Component;

class ImageFactory extends Component<Props, State> {
  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return true;
  }

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

        const {uri} = await ImageManipulator.manipulateAsync(path, ops, {
          compress: jpegCompression,
          format: 'jpeg',
        });

        // Move to a "permanent" location, in case the form submission is sent in the future (e.g. user is offline).
        const dir = await persist.initArbitraryDirectory(DIR);
        const filename = uri.match(/\/([^\/]+)$/)[1]; // Gets everything after the last slash character (e.g. "a.jpg" if uri == "/path/to/a.jpg").
        let newUri = dir + "/" + filename;
        await FileSystem.moveAsync({
          from: uri,
          to: newUri,
        });

        resolve(newUri);
      }, () => reject());
    });
  };

  _getImageFromStorage = async (path: string) => {
    const newPath: string = await this._resizeImage(path);

    // We don't need the original file anymore
    await FileSystem.deleteAsync(path, {idempotent: true});

    this.setState({value: newPath});
    super.getLocals().onChange(newPath);
  };

  getTemplate() {
    return (locals: Object) => {
      if (locals.hidden === true) {
        return null;
      }

      const stylesheet = locals.stylesheet;
      let topContainer = stylesheet.imagePicker
        ? stylesheet.imagePicker.topContainer
        : styles.topContainer;
      let container = stylesheet.imagePicker
        ? stylesheet.imagePicker.container
        : styles.container;

      const widgetType = locals.config !== undefined && locals.config.widgetType !== undefined
        ? locals.config.widgetType
        : 'normal';

      switch (widgetType) {
        case 'profile-picture':
          return (
            <View style={locals.hasError ? stylesheet.formGroup.error : stylesheet.formGroup.normal}>
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
              <View style={{flexDirection: "row", alignItems: "center"}}>
                <View style={{flex: 1, alignItems: "center"}}>
                  <View
                    style={[
                      styles.topPictureContainer,
                      locals.hasError ? {borderColor: '#a94442'} : {},
                    ]}>
                    {this.state.value
                      ? <Image
                        resizeMode="cover"
                        source={{
                          uri: this.state.value
                        }}
                        style={{height: 150}}
                      />
                      : null
                    }
                    <View
                      style={[
                        container,
                        locals.hasError ? {backgroundColor: '#E28E8E'} : {}
                      ]}>
                      <FontAwesome name={"user"} size={70} color={vars.VERY_LIGHT_GREY} style={styles.icon}/>
                    </View>
                  </View>
                </View>
                <View style={styles.buttonPictureContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                      ImagePicker.launchCameraAsync({mediaTypes: "Images"}).then((image: Object) =>
                      {
                        if (image.cancelled)
                          return;
                        this._getImageFromStorage(image.uri)
                      })}>
                    <FontAwesome name="camera" size={24} color={vars.SHELTER_GREY} style={styles.icon}/>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                      ImagePicker.launchImageLibraryAsync({mediaTypes: "Images"}).then((image: Object) =>
                      {
                        if (image.cancelled)
                          return;
                        this._getImageFromStorage(image.uri)
                      })}>
                    <FontAwesome name="file-image-o" size={24} color={vars.SHELTER_GREY} style={styles.icon}/>
                  </TouchableOpacity>

                  {this.state.value
                    ? <TouchableOpacity
                      style={styles.button}
                      onPress={() =>
                      {
                        this.setState({image: null});
                        super.getLocals().onChange(null);
                      }}>
                      <FontAwesome name="times" size={24} color={vars.SHELTER_GREY} style={styles.icon}/>
                    </TouchableOpacity>
                    : null
                  }
                </View>
              </View>
              {locals.help || locals.config.help ? (
                <Text style={[
                  locals.hasError ? stylesheet.helpBlock.error : stylesheet.helpBlock.normal,
                  {paddingVertical: 10, flex: 1},
                ]}>
                  {locals.help || locals.config.help}
                </Text>
              ) : null}
            </View>
          );

        default:
          return (
            <View style={locals.hasError ? stylesheet.formGroup.error : stylesheet.formGroup.normal}>
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
                {this.state.value
                  ? <Image
                    resizeMode="cover"
                    source={{
                      uri: this.state.value
                    }}
                    style={{height: 150}}
                  />
                  : null
                }
                <View
                  style={[
                    container,
                    locals.hasError ? {backgroundColor: '#E28E8E'} : {}
                  ]}>
                  <FontAwesome name={"picture-o"} size={90} color={vars.VERY_LIGHT_GREY} style={styles.icon}/>
                </View>
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

                {this.state.value
                  ? <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                    {
                      this.setState({image: null});
                      super.getLocals().onChange(null);
                    }}>
                    <FontAwesome name="times" size={24} color={vars.SHELTER_GREY} style={styles.icon}/>
                  </TouchableOpacity>
                  : null
                }

                <TouchableOpacity
                  style={styles.button}
                  onPress={() =>
                    ImagePicker.launchCameraAsync({mediaTypes: "Images"}).then((image: Object) =>
                    {
                      if (image.cancelled)
                        return;
                      this._getImageFromStorage(image.uri)
                    })}>
                  <FontAwesome name="camera" size={24} color={vars.SHELTER_GREY} style={styles.icon}/>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() =>
                    ImagePicker.launchImageLibraryAsync({mediaTypes: "Images"}).then((image: Object) =>
                    {
                      if (image.cancelled)
                        return;
                      this._getImageFromStorage(image.uri)
                    })}>
                  <FontAwesome name="file-image-o" size={24} color={vars.SHELTER_GREY} style={styles.icon}/>
                </TouchableOpacity>
              </View>
            </View>
          );
      }
    };
  }
}

const styles = StyleSheet.create({
  topContainer: {
    overflow: 'hidden',
    borderRadius: 2,
    height: 150,
    borderColor: vars.SHELTER_GREY,
    borderWidth: 1,
  },
  topPictureContainer: {
    overflow: 'hidden',
    borderRadius: 75,
    width: 150,
    height: 150,
    borderColor: vars.SHELTER_GREY,
    borderWidth: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    borderRadius: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  buttonPictureContainer: {
    flexDirection: "column",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  icon: {
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

export default ImageFactory;
