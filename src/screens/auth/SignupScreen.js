// @flow

import React from 'react';
import {signup} from '../../actions';
import {connect} from 'react-redux';
import NavTitleContainer from "../../containers/NavTitleContainer";
import Signup from "./Signup";
import {propEqual} from "../../util";
import type {lastErrorType} from "../../reducers/lastError";
import type {navigation} from "../../nav";

type Props = {
  loggedIn: boolean,
  online: boolean,
  loggingIn: boolean,
  lastError: lastErrorType,
  signup: () => {},
  navigation: navigation,
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
  signup: values => dispatch(signup(values)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen)