// @flow

import React from 'react';
import {ImageBackground, KeyboardAvoidingView, StyleSheet, Text, TextInput, View, TouchableOpacity} from 'react-native';
import Button from "../../components/Button";
import vars from "../../vars";
import t from 'tcomb-form-native';
import type {lastErrorType} from "../../reducers/lastError";
import {propEqual} from "../../util";
import type {navigation} from "../../nav";
import i18n from "../../i18n";
import TranslatedText from "../../components/TranslatedText";
import {connect} from 'react-redux';
import {ScrollView} from "../user/Settings";
import {updadeCurrentLanguage} from "../../actions";

const Form = t.form.Form;

type Props = {
  submit: (username: string, password: string) => {},
  online: boolean,
  loggingIn: boolean,
  lastError: lastErrorType,
  navigation: navigation,
  languageOptions: [],
}

type State = {
  formValues: { username: string, password: string },
}

class Login extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      formValues: {username: "", password: ""},
    };
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return nextProps.languageOptions.length != this.props.languageOptions.length ||
      !propEqual(this.state, nextState, [], ['formValues'])
      || !propEqual(this.props, nextProps, ['online', 'loggingIn'], ['lastError']);
  }

  login() {
    if (this.refs.form.validate().isValid()) {
      this.props.submit(this.state.formValues.username, this.state.formValues.password);
    }
  }

  _onSwitchLanguage(lang) {
    this.props.setLanguage(lang);
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
        { online && <View style={[styles.innerContainer, styles.languageSwitcher]}>
          { this.props.languageOptions.map((lang) => (
            <TouchableOpacity
              key={lang}
              onPress={() => this._onSwitchLanguage(lang)}
              style={styles.languageButton}
            >
              <Text style={styles.languageText}>{lang}</Text>
            </TouchableOpacity>
          ))}
        </View> }
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
  languageButton: {
    backgroundColor: vars.SHELTER_RED,
    padding: 5,
    textAlign: "center",
    width: 30,
  },
  languageText: {
    color: '#fff',
    textAlign: "center",
  },
  languageSwitcher: {
    flexDirection: 'row',
    justifyContent: "space-around",
    paddingBottom: 10,
    paddingTop: 10,
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

const mapStateToProps = state => ({
  enabledLanguages: state.languages.enabled,
  languageOptions: Object.keys(state.languages.enabled).map((lang) => lang)
});

const mapDispatchToProps = dispatch => ({
  setLanguage: (lang) => dispatch(updadeCurrentLanguage(lang)),
});

export default Login = connect(mapStateToProps, mapDispatchToProps)(Login);
