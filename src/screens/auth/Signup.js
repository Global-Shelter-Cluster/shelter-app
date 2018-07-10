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
  signup: () => {},
  online: boolean,
  loggingIn: boolean,
  lastError: lastErrorType,
}

type State = {
  formValues: { email: string, password: string },
}

export default class Signup extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      formValues: {first_name: "", name:"", organization:"", email: "", password: ""},
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !propEqual(this.state, nextState, [], ['formValues'])
      || !propEqual(this.props, nextProps, ['online', 'loggingIn'], ['lastError']);
  }

  onPress() {
    if (this.refs.form.getValue()) {
      this.props.signup(this.state.formValues);
    }
  }

  render() {
    const {signup, online, loggingIn, lastError} = this.props;

    const errorMessage = lastError.type === 'login-error'
      ? <Text style={styles.error}>{lastError.data.message}</Text>
      : null;

    let signupButton;
    if (!online)
      signupButton = <Text style={styles.text}>No internet connection detected.</Text>;
    else if (loggingIn)
      signupButton = <Text style={styles.text}>Logging in...</Text>;
    else {
      signupButton = <Button
        primary title="Signup"
        onPress={this.onPress.bind(this)}
      />;
    }
    const backToLoginButton = <Button onPress={async () => {
      this.props.navigation.navigate('Login');;
    }} title="Back to login form"/>;

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <StatusBar barStyle="light-content"/>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>{"Shelter Cluster\nApp Prototype"}</Text>
          <Text style={styles.text}>{"Create your account to signup"}</Text>
          {errorMessage}
          {online && !loggingIn && <Form
            ref="form"
            type={formFields} options={formOptions}
            onChange={formValues => this.setState({formValues})} value={this.state.formValues}
          />}
          {signupButton}
          {backToLoginButton}
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
  name: t.String,
  organization: t.String,
  email: t.String,
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
