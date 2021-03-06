// @flow

import React from "react";
import {ImageBackground, StyleSheet, Text, View, Animated, Easing} from "react-native";
import {FontAwesome} from '@expo/vector-icons';
import vars from "../vars";
import TranslatedText from "./TranslatedText";

const image = require("../../assets/logo-dim.png");

export default class Loading extends React.Component {
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

    return <View style={styles.container}>
      <ImageBackground style={styles.image} source={image}>
        <Animated.View style={{transform: [{rotate: spin}]}}>
          <FontAwesome name={"refresh"} size={80} color={vars.LIGHT_GREY}/>
        </Animated.View>
      </ImageBackground>
      <TranslatedText style={styles.label}>Loading...</TranslatedText>
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
});
