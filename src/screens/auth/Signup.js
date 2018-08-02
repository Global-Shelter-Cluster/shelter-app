// @flow

import React from 'react';
import {ImageBackground, KeyboardAvoidingView, StatusBar, StyleSheet, Text, TextInput, View} from 'react-native';
import Button from "../../components/Button";
import vars from "../../vars";
import t from 'tcomb-form-native';
import type {lastErrorType} from "../../reducers/lastError";
import {propEqual} from "../../util";
import type {navigation} from "../../nav";

const Form = t.form.Form;

type Props = {
  signup: (newAccountValues) => {},
  online: boolean,
  loggingIn: boolean,
  lastError: lastErrorType,
  navigation: navigation,
}

type State = {
  formValues: newAccountValues,
}

export default class Signup extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      formValues: {name: "", organization: "", email: "", password: ""},
    };
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return !propEqual(this.state, nextState, [], ['formValues'])
      || !propEqual(this.props, nextProps, ['online', 'loggingIn'], ['lastError']);
  }

  signup() {
    if (this.refs.form.validate().isValid()) {
      this.props.signup(this.state.formValues);
    }
  }

  render() {
    const {online, loggingIn, lastError} = this.props;

    const errorMessage = lastError.type === 'signup-error'
      ? <Text style={styles.error}>{lastError.data.message}</Text>
      : null;

    let signupButton;
    if (!online)
      signupButton = <Text style={styles.text}>No internet connection detected.</Text>;
    else if (loggingIn)
      signupButton = <Text style={styles.text}>Creating your account...</Text>;
    else {
      signupButton = <Button
        primary title="Signup"
        onPress={() => this.signup()}
      />;
    }
    const backToLoginButton = !loggingIn
      ? <Button onPress={() => {
        this.props.navigation.navigate('Login');
      }} title="Back to login form"/>
      : null;

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <StatusBar barStyle="light-content"/>
        <View style={styles.innerContainer}>
          {!loggingIn
            ? <Text style={styles.banner}>{"Create a Shelter Cluster account"}</Text>
            : null
          }
          {errorMessage}
          {online && !loggingIn && <Form
            ref="form"
            type={t.struct({
              name: t.String,
              organization: t.String,
              email: t.refinement(t.String, email => {
                // valid email address
                const reg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
                return reg.test(email);
              }),
              password: t.refinement(t.String, value => value.length >= 8), // 8 chars minimum length
            })}
            options={{
              label: null,
              auto: "placeholders",
              stylesheet: formStyles,
              fields: {
                name: {
                  textContentType: "name",
                  onSubmitEditing: () => this.refs.form.getComponent('organization').refs.input.focus(),
                  returnKeyType: "next",
                },
                organization: {
                  textContentType: "organizationName",
                  onSubmitEditing: () => this.refs.form.getComponent('email').refs.input.focus(),
                  returnKeyType: "next",
                },
                email: {
                  textContentType: "emailAddress",
                  keyboardType: "email-address",
                  onSubmitEditing: () => this.refs.form.getComponent('password').refs.input.focus(),
                  returnKeyType: "next",
                },
                password: {
                  textContentType: "password",
                  password: true,
                  secureTextEntry: true,
                  onSubmitEditing: () => this.signup(),
                  returnKeyType: "go",
                },
              },
            }}
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
    justifyContent: "flex-end",
  },
  innerContainer: {
    padding: 20,
    paddingBottom: 30,
    justifyContent: "space-between",
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    color: "black",
    marginBottom: 0,
  },
  banner: {
    fontSize: 18,
    textAlign: "center",
    color: vars.SHELTER_RED,
    marginBottom: 20,
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

export type newAccountValues = {
  name: string,
  organization: string,
  email: string,
  password: string,
}