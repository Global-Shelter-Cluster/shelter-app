// @flow

import React from 'react';
import {signup} from '../../actions';
import {connect} from 'react-redux';
import NavTitleContainer from "../../containers/NavTitleContainer";
import Signup from "./Signup";
import {propEqual} from "../../util";
import type {lastErrorType} from "../../reducers/lastError";

type Props = {
  loggedIn: boolean,
  online: boolean,
  loggingIn: boolean,
  lastError: lastErrorType,
  signup: () => {},
}

class SignupScreen extends React.Component<Props> {
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
  signup: (email, pass) => dispatch(signup(email, pass)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen)
