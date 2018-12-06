// @flow

import React from "react";
import {Image, StyleSheet, Text, View} from "react-native";
import {FontAwesome} from '@expo/vector-icons';
import vars from "../vars";
import Button from "./Button";

const image = require("../../assets/logo.png");

export default class Notice extends React.Component {
  render() {
    const secondary = this.props.secondaryButtonLabel !== undefined
      ? <Button
        style={styles.secondaryButton}
        onPress={this.props.secondaryAction} title={this.props.secondaryButtonLabel}
      />
      : null;

    return <View style={styles.container}>
      <Image style={styles.image} source={image}/>
      <Text style={styles.label}>{this.props.description}</Text>
      {this.props.buttonLabel !== undefined && this.props.buttonLabel &&
      <Button
        style={styles.button} primary
        onPress={this.props.action} title={this.props.buttonLabel}
      />}
      {secondary}
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
  secondaryButton: {
    marginTop: 20,
  },
});
