// @flow

import React from 'react';
import {login} from '../../actions';
import {connect} from 'react-redux';
import NavTitleContainer from "../../containers/NavTitleContainer";
import Login from "./Login";

class LoginScreen extends React.Component {
  static navigationOptions = {
    headerTitle: <NavTitleContainer title="Log in"/>,
  };

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
});

const mapDispatchToProps = dispatch => ({
  login: (user, pass) => dispatch(login(user, pass)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
