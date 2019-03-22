// @flow

import React from 'react';
import {ImageBackground, KeyboardAvoidingView, StyleSheet, Text, TextInput, View} from 'react-native';
import Button from "../../components/Button";
import vars from "../../vars";
import t from 'tcomb-form-native';
import type {lastErrorType} from "../../reducers/lastError";
import {propEqual} from "../../util";
import type {navigation} from "../../nav";
import i18n from "../../i18n";
import TranslatedText from "../../components/TranslatedText";

const Form = t.form.Form;

type Props = {
  submit: (username: string, password: string) => {},
  online: boolean,
  loggingIn: boolean,
  lastError: lastErrorType,
  navigation: navigation,
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

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return !propEqual(this.state, nextState, [], ['formValues'])
      || !propEqual(this.props, nextProps, ['online', 'loggingIn'], ['lastError']);
  }

  login() {
    if (this.refs.form.validate().isValid()) {
      this.props.submit(this.state.formValues.username, this.state.formValues.password);
    }
  }

  render() {
    const {online, loggingIn, lastError} = this.props;

    const errorMessage = lastError.type === 'login-error'
      ? <Text style={styles.error}>{lastError.data.message}</Text>
      : null;

    let loginButton;
    if (!online)
      loginButton = <TranslatedText style={styles.text}>No internet connection detected.</TranslatedText>;
    else if (loggingIn)
      loginButton = <TranslatedText style={styles.text}>Logging in...</TranslatedText>;
    else {
      loginButton = <Button
        primary title={i18n.t("Log in")}
        onPress={() => this.login()}
      />;
    }

    const signupButton = !loggingIn && online
      ? <Button onPress={() => {
        this.props.navigation.navigate('Signup');
      }} title={i18n.t("Sign up")} />
      : null;

    const forgotButton = !loggingIn && online
      ? <Button
        dimmed style={{marginTop: 5}}
        onPress={() => {
          this.props.navigation.navigate('Forgot');
        }} title={i18n.t("Forgot your username/password?")} />
      : null;

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <ImageBackground
          style={{flex: 1}}
          imageStyle={{maxWidth: 400, maxHeight: 400}}
          source={require('../../../assets/splash.png')}/>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>ShelterCluster.org</Text>
          {errorMessage}
          {online && !loggingIn && <Form
            ref="form"
            type={t.struct({
              username: t.String,
              password: t.String,
            })}
            options={{
              label: null,
              auto: "placeholders",
              stylesheet: formStyles,
              fields: {
                username: {
                  textContentType: "username",
                  placeholder: i18n.t("Username or e-mail address"),
                  onSubmitEditing: () => this.refs.form.getComponent('password').refs.input.focus(),
                  returnKeyType: "next",
                  autoCapitalize: "none",
                },
                password: {
                  textContentType: "password",
                  placeholder: i18n.t("Password"),
                  password: true,
                  secureTextEntry: true,
                  onSubmitEditing: () => this.login(),
                  returnKeyType: "go",
                },
              },
            }}
            onChange={formValues => this.setState({formValues})} value={this.state.formValues}
          />}
          {loginButton}
          {signupButton}
          {forgotButton}
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: vars.BG_GREY,
    flex: 1,
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
