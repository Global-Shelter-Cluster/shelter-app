// @flow

import React from 'react';
import {login} from '../../actions';
import {connect} from 'react-redux';
import NavTitleContainer from "../../containers/NavTitleContainer";
import Login from "./Login";
import type {lastErrorType} from "../../reducers/lastError";

class LoginScreen extends React.Component {
  static navigationOptions = {
    headerTitle: <NavTitleContainer title="Register"/>,
  };

  // componentDidMount() {
  //   if (this.props.loggedIn)
  //     this.props.navigation.navigate('User');
  // }

  // componentDidUpdate() {
  //   if (this.props.loggedIn)
  //     this.props.navigation.navigate('User');
  // }

  render() {
    <Text>FNORD</Text>;
  }
}

// const mapStateToProps = state => ({
//   loggedIn: state.currentUser !== null,
//   online: state.flags.online,
//   loggingIn: state.flags.loggingIn,
//   lastError: state.lastError,
// });

// const mapDispatchToProps = dispatch => ({
//   login: (user, pass) => dispatch(login(user, pass)),
// });

export default LoginScreen; //connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
