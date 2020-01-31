// @flow

import React from 'react';
import {signup} from '../../actions';
import {connect} from 'react-redux';
import NavTitleContainer from "../../containers/NavTitleContainer";
import type {newAccountValues} from "./Signup";
import Signup from "./Signup";
import {propEqual} from "../../util";
import type {lastErrorType} from "../../reducers/lastError";
import type {navigation} from "../../nav";
import {hitPage} from "../../analytics";
import i18n from "../../i18n";

type Props = {
  loggedIn: boolean,
  online: boolean,
  loggingIn: boolean,
  lastError: lastErrorType,
  submit: (newAccountValues) => {},
  navigation: navigation,
}

class SignupScreen extends React.Component<Props> {
  static navigationOptions = {
    headerTitle: <NavTitleContainer title={i18n.t("Log in")} />,
  };

  shouldComponentUpdate(nextProps) {
    return !propEqual(this.props, nextProps, ['loggedIn', 'online', 'loggingIn'], ['lastError']);
  }

  componentDidMount() {
    this.props.navigation.addListener(
      'didFocus',
      payload => hitPage(payload.state.routeName),
    );

    if (this.props.loggedIn)
      this.props.navigation.navigate('Me');
  }

  componentDidUpdate() {
    if (this.props.loggedIn)
      this.props.navigation.navigate('Me');
  }

  render() {
    return <Signup {...this.props}/>;
  }
}

const mapStateToProps = state => ({
  loggedIn: state.currentUser !== null,
  online: state.flags.online,
  loggingIn: state.flags.loggingIn,
  lastError: state.lastError,
});

const mapDispatchToProps = dispatch => ({
  submit: values => dispatch(signup(values)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen)
