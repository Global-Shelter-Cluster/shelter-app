// @flow

import React from 'react';
import {login} from '../../actions';
import {connect} from 'react-redux';
import NavTitleContainer from "../../containers/NavTitleContainer";
import Login from "./Login";
import {propEqual} from "../../util";
import type {lastErrorType} from "../../reducers/lastError";

type Props = {
  loggedIn: boolean,
  online: boolean,
  loggingIn: boolean,
  lastError: lastErrorType,
  login: (username: string, password: string) => {},
}

class LoginScreen extends React.Component<Props> {
  static navigationOptions = {
    headerTitle: <NavTitleContainer title="Log in"/>,
  };

  shouldComponentUpdate(nextProps) {
    return !propEqual(this.props, nextProps, ['loggedIn', 'online', 'loggingIn'], ['lastError']);
  }

  componentDidMount() {
    if (this.props.loggedIn)
      this.props.navigation.navigate('User');
  }

  componentDidUpdate() {
    if (this.props.loggedIn)
      this.props.navigation.navigate('User');
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
  login: (user, pass) => dispatch(login(user, pass)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
