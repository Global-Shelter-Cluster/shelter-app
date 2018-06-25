// @flow

import React from "react";
import {ImageBackground, StyleSheet, Text, View} from "react-native";
import {FontAwesome} from '@expo/vector-icons';
import vars from "../vars";
import Button from "./Button";

const image = require("../../assets/logo-dim.png");

export default class Error extends React.Component {
  render() {
    return <View style={styles.container}>
      <ImageBackground style={styles.image} source={image}>
        <FontAwesome name={"ban"} size={80} color={vars.ACCENT_RED}/>
      </ImageBackground>
      <Text style={styles.label}>{this.props.description}</Text>
      {this.props.buttonLabel !== undefined && this.props.buttonLabel &&
      <Button
        style={styles.button} primary
        onPress={this.props.action} title={this.props.buttonLabel}
      />}
    </View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  label: {
    color: vars.MEDIUM_GREY,
    fontSize: 18,
    textAlign: "center",
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginTop: 80,
  },
});
