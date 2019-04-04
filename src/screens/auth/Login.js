// @flow

import React from 'react';
import {ImageBackground, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
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
import {getTranslations, updadeCurrentLanguage} from "../../actions";
import {FontAwesome} from '@expo/vector-icons';

const Form = t.form.Form;

type Props = {
  submit: (username: string, password: string) => {},
  online: boolean,
  loggingIn: boolean,
  lastError: lastErrorType,
  navigation: navigation,
  languageOptions: {},
  setLanguage: (lang: string) => {},
  currentLanguage: string,
}

type State = {
  formValues: { username: string, password: string },
  languageSwitcherOpen: boolean,
}

class Login extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      formValues: {username: "", password: ""},
      languageSwitcherOpen: false,
    };
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return !propEqual(this.state, nextState, ['languageSwitcherOpen'], ['formValues'])
      || !propEqual(this.props, nextProps, ['currentLanguage', 'online', 'loggingIn'], ['lastError', 'languageOptions']);
  }

  login() {
    if (this.refs.form.validate().isValid()) {
      this.props.submit(this.state.formValues.username, this.state.formValues.password);
    }
  }

  async _onSwitchLanguage(lang) {
    this.props.setLanguage(lang);
    await this.props.getTranslations(lang);
    // Reset the navigation stack.
    this.props.navigation.navigate('Signup');
    this.props.navigation.navigate('Login');
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
      }} title={i18n.t("Sign up")}/>
      : null;

    const forgotButton = !loggingIn && online
      ? <Button
        small dimmed style={{marginTop: 5, flex: 1}}
        onPress={() => {
          this.props.navigation.navigate('Forgot');
        }} title={i18n.t("Forgot your username/password?")}/>
      : null;

    const showLanguageSwitcher = online && !loggingIn && Object.keys(this.props.languageOptions).length > 1;

    const languageSwitcherToggle = <TouchableOpacity
      onPress={() => this.setState({languageSwitcherOpen: !this.state.languageSwitcherOpen})}
    >
      <FontAwesome name="globe" size={30}
                   color={this.state.languageSwitcherOpen ? vars.SHELTER_RED : vars.SHELTER_GREY}/>
    </TouchableOpacity>;

    const languageSwitcher = <View style={[styles.innerContainer, styles.languageSwitcher]}>
      {Object.keys(this.props.languageOptions).map(lang => (
        <TouchableOpacity
          key={lang}
          onPress={() => this._onSwitchLanguage(lang)}
          style={styles.languageButton}
        >
          <Text style={styles.languageText}>
            {this.props.languageOptions[lang].native}
            {this.props.languageOptions[lang].native}
          </Text>
        </TouchableOpacity>
      ))}
    </View>;

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
          <View style={styles.bottomContainer}>
            {showLanguageSwitcher && this.state.languageSwitcherOpen ? languageSwitcher : forgotButton}
            {showLanguageSwitcher ? languageSwitcherToggle : null}
          </View>
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
    padding: 20,
    paddingBottom: 30,
    justifyContent: "space-between",
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  languageButton: {
    backgroundColor: vars.SHELTER_RED,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 1,
    marginTop: 1,
    textAlign: "center",
  },
  languageText: {
    color: "white",
    textAlign: "center",
  },
  languageSwitcher: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: 'row',
    justifyContent: "center",
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
  languageOptions: state.languages.enabled,
  currentLanguage: state.languages.currentLanguage,
});

const mapDispatchToProps = dispatch => ({
  setLanguage: (lang) => dispatch(updadeCurrentLanguage(lang)),
  getTranslations: (lang, forceRefresh = false) => dispatch(getTranslations(lang, forceRefresh)),
});

export default Login = connect(mapStateToProps, mapDispatchToProps)(Login);
