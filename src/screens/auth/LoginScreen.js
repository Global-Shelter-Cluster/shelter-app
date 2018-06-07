// @flow

import React from 'react';
import {Button, Text, View} from 'react-native';
import {login} from '../../actions';
import {connect} from 'react-redux';
import NavTitleContainer from "../../containers/NavTitleContainer";

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
    return <View>
      <Text>Log in screen</Text>
      <Button onPress={() => this.props.login("myuser", "mypwd")} title="Log in"/>
    </View>;
  }
}

const mapStateToProps = state => ({
  initializing: state.initializing,
  loggedIn: state.currentUser !== null,
});

const mapDispatchToProps = dispatch => ({
  login: (user, pass) => dispatch(login(user, pass)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
