// @flow

import React from 'react';
import {login} from '../../actions';
import {connect} from 'react-redux';
import NavTitleContainer from "../../containers/NavTitleContainer";
import Login from "./Login";
import {propEqual} from "../../util";
import type {lastErrorType} from "../../reducers/lastError";
import type {navigation} from "../../nav";
import analytics from "../../analytics";
import {PageHit} from "expo-analytics";
import i18n from "../../i18n";

type Props = {
  loggedIn: boolean,
  online: boolean,
  loggingIn: boolean,
  lastError: lastErrorType,
  submit: (username: string, password: string) => {},
  navigation: navigation,
}

class LoginScreen extends React.Component<Props> {
  static navigationOptions = {
    headerTitle: <NavTitleContainer title={i18n.t("Log in")} />,
  };

  shouldComponentUpdate(nextProps) {
    return !propEqual(this.props, nextProps, ['loggedIn', 'online', 'loggingIn'], ['lastError']);
  }

  componentDidMount() {
    this.props.navigation.addListener(
      'didFocus',
      payload => analytics.hit(new PageHit(payload.state.routeName)),
    );

    if (this.props.loggedIn)
      this.props.navigation.navigate('Me');
  }

  componentDidUpdate() {
    if (this.props.loggedIn)
      this.props.navigation.navigate('Me');
  }

  render() {
    return <Login {...this.props}/>;
  }
}

const mapStateToProps = state => ({
  loggedIn: state.currentUser !== null,
  online: state.flags.online,
  loggingIn: state.flags.loggingIn,
  lastError: state.lastError,
});

const mapDispatchToProps = dispatch => ({
  submit: (user, pass) => dispatch(login(user, pass)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
