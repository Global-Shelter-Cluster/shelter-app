// @flow

import React from 'react';
import {ImageBackground, StatusBar, StyleSheet, Text, TextInput, View, KeyboardAvoidingView} from 'react-native';
import Button from "../../components/Button";
import vars from "../../vars";
import t from 'tcomb-form-native';
import type {lastErrorType} from "../../reducers/lastError";
import equal from 'deep-equal';

const Form = t.form.Form;

type Props = {
  login: () => {},
  online: boolean,
  loggingIn: boolean,
  lastError: lastErrorType,
}

export default class Login extends React.Component<Props> {
  render() {
    const {login, online, loggingIn, lastError} = this.props;
    let error;
    if (lastError.data) {
      error = <Text style={styles.text}>{lastError.data.error_data.error_description}</Text>;
    }
    let button;
    if (!online)
      button = <Text style={styles.text}>No internet connection detected.</Text>;
    else if (loggingIn)
      button = <Text style={styles.text}>Logging in...</Text>;
    else {
      button = <Button primary onPress={() => {
        const value = this.refs.form.getValue();
        if (value)
          login(value.username, value.password)
      }} title="Log in"/>;
    }

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <StatusBar barStyle="light-content"/>
        <ImageBackground style={styles.image} source={require('../../../assets/login.jpg')}>
        </ImageBackground>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>{"Shelter Cluster\nApp Prototype"}</Text>
          {error}
          {online && !loggingIn && <Form ref="form" type={formFields} options={formOptions}/>}
          {button}
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: vars.SHELTER_DARK_BLUE,
    flex: 1,
  },
  image: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-end",
  },
  innerContainer: {
    // flexShrink: 1,
    padding: 20,
    paddingBottom: 30,
    // height: 165,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    color: vars.SHELTER_RED,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    color: "black",
    marginBottom: 0,
  },
});

const formStyles = {
  ...Form.stylesheet,
  textbox: {
    ...Form.stylesheet.textbox,
    normal: {
      ...Form.stylesheet.textbox.normal,
      borderColor: vars.SHELTER_RED,
      borderRadius: 2,
    },
    error: {
      ...Form.stylesheet.textbox.error,
      borderColor: vars.ACCENT_RED,
      borderRadius: 2,
    },
  },
};

const formFields = t.struct({
  username: t.String,
  password: t.String,
});

const formOptions = {
  label: null,
  auto: "placeholders",
  stylesheet: formStyles,
  fields: {
    password: {
      password: true,
      secureTextEntry: true,
    },
  },
};
