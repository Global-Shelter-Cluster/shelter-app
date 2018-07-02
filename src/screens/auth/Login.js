// @flow

import React from 'react';
import {ImageBackground, StyleSheet, Text, View, StatusBar, TextInput} from 'react-native';
import Button from "../../components/Button";
import vars from "../../vars";

let creds = {
  'password': '',
  'username': '',
}

export default ({login, online, loggingIn}: {
  login: () => {},
  online: boolean,
  loggingIn: boolean,
}) => {
  let button;
  let inputs;

  if (!online)
    button = <Text style={styles.text}>No internet connection detected.</Text>;
  else if (loggingIn)
    button = <Text style={styles.text}>Logging in...</Text>;
  else {
    button = <Button primary onPress={() => login(creds.username, creds.password)} title="Log in"/>;
    inputs = (
      <View>
        <Text>Username:</Text>
        <TextInput
          style={styles.textinput}
          onChangeText={(text) => creds.username = text}
        />
        <Text>Password:</Text>
        <TextInput
          style={styles.textinput}
          onChangeText={(text) => creds.password = text}
        />
        </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
      />
      <ImageBackground style={styles.image} source={require('../../../assets/login.jpg')}/>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>{"Shelter Cluster\nApp Prototype"}</Text>
        {inputs}
        {button}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: vars.SHELTER_DARK_BLUE,
    flex: 1,
  },
  image: {
    width: "100%",
    height: "55%",
    flexShrink: 1,
  },
  innerContainer: {
    padding: 20,
    paddingBottom: 30,
    height: 165,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    color: vars.SHELTER_RED,
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    color: "white",
  },
  textinput: {
    height: 40,
  }
});
