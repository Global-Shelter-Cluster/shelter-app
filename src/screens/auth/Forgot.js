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
  submit: (value: string) => {},
  online: boolean,
  loggingIn: boolean,
  lastError: lastErrorType,
  navigation: navigation,
}

type State = {
  formValues: {value: string},
  submitted: boolean,
}

export default class Forgot extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      formValues: {value: ""},
      submitted: false,
    };
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return !propEqual(this.state, nextState, [], ['formValues'])
      || !propEqual(this.props, nextProps, ['online', 'loggingIn'], ['lastError']);
  }

  submit() {
    if (this.refs.form.validate().isValid()) {
      this.props.submit(this.state.formValues.value);
      this.setState({submitted: true});
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.state.submitted
      && nextProps.lastError
      && nextProps.lastError.type === 'request-new-password-error'
    )
      this.setState({submitted: false});
  }

  render() {
    const {online, loggingIn, lastError} = this.props;
    const {submitted} = this.state;

    const errorMessage = lastError.type === 'request-new-password-error'
      ? <Text style={styles.error}>{lastError.data.message}</Text>
      : null;

    let requestButton;
    if (submitted && errorMessage === null && !loggingIn)
      requestButton = <Text style={styles.text}>Further instructions have been sent to your e-mail address.</Text>;
    else if (!online)
      requestButton = <Text style={styles.text}>No internet connection detected.</Text>;
    else if (loggingIn)
      requestButton = <Text style={styles.text}>Requesting a new password for your account...</Text>;
    else {
      requestButton = <Button
        primary title="Request password"
        onPress={() => this.submit()}
      />;
    }
    const backToLoginButton = !loggingIn
      ? <Button onPress={() => {
        this.props.navigation.navigate('Login');
      }} title="Back to Log in"/>
      : null;

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <StatusBar barStyle="light-content"/>
        <View style={styles.innerContainer}>
          {!loggingIn && !submitted
            ? <Text style={styles.banner}>{"Request a new password for your Shelter\u00A0Cluster\u00A0account"}</Text>
            : null
          }
          {errorMessage}
          {online && !loggingIn && !submitted && <Form
            ref="form"
            type={t.struct({
              value: t.String,
            })}
            options={{
              label: null,
              auto: "placeholders",
              stylesheet: formStyles,
              fields: {
                value: {
                  placeholder: "Username or e-mail address",
                  onSubmitEditing: () => this.submit(),
                  returnKeyType: "go",
                },
              },
            }}
            onChange={formValues => this.setState({formValues})} value={this.state.formValues}
          />}
          {requestButton}
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
