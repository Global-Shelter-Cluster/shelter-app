// @flow

import React from 'react';
import {ImageBackground, KeyboardAvoidingView, StatusBar, StyleSheet, Text, TextInput, View} from 'react-native';
import Button from "../../components/Button";
import vars from "../../vars";
import t from 'tcomb-form-native';
import type {lastErrorType} from "../../reducers/lastError";
import {propEqual} from "../../util";

const Form = t.form.Form;

type Props = {
  login: () => {},
  online: boolean,
  loggingIn: boolean,
  lastError: lastErrorType,
}

type State = {
  formValues: { username: string, password: string },
}

export default class Login extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      formValues: {username: "", password: ""},
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !propEqual(this.state, nextState, [], ['formValues'])
      || !propEqual(this.props, nextProps, ['online', 'loggingIn'], ['lastError']);
  }

  render() {
    const {login, online, loggingIn, lastError} = this.props;

    const errorMessage = lastError.type === 'login-error'
      ? <Text style={styles.error}>{lastError.data.message}</Text>
      : null;

    let loginButton;
    if (!online)
      loginButton = <Text style={styles.text}>No internet connection detected.</Text>;
    else if (loggingIn)
      loginButton = <Text style={styles.text}>Logging in...</Text>;
    else {
      loginButton = <Button
        primary title="Log in"
        onPress={() => login(this.state.formValues.username, this.state.formValues.password)}
      />;
    }

    const registerButton = <Button onPress={async () => {
      console.log('Work in progress');
    }} title="Register"/>;

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <StatusBar barStyle="light-content"/>
        <ImageBackground style={styles.image} source={require('../../../assets/login.jpg')}>
        </ImageBackground>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>{"Shelter Cluster\nApp Prototype"}</Text>
          {errorMessage}
          {online && !loggingIn && <Form
            type={formFields} options={formOptions}
            onChange={formValues => this.setState({formValues})} value={this.state.formValues}
          />}
          {loginButton}
          {/*{registerButton}*/}
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
  error: {
    fontSize: 16,
    textAlign: "center",
    color: vars.SHELTER_RED,
    marginBottom: 20,
    marginHorizontal: 20,
  },
});

const formStyles = {
  ...Form.stylesheet,
  textbox: {
    ...Form.stylesheet.textbox,
    normal: {
      ...Form.stylesheet.textbox.normal,
      borderColor: vars.SHELTER_GREY,
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
