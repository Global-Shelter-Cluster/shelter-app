// @flow

import React from 'react';
import {Button, View} from 'react-native';
import {logout} from "../../actions";
import {connect} from 'react-redux';
import type {PrivateUserObject} from "../../model/user";
import {getCurrentUser} from "../../model/user";
import Dashboard from './Dashboard';
import {FontAwesome} from '@expo/vector-icons';
import vars from "../../vars";

type Props = {
  online: boolean,
  user: PrivateUserObject,
  navigation: { setParams: ({}) => {}, getParam: (string) => {}, navigate: (string) => {} },
  logout: () => {},
}

const mapStateToProps = state => ({
  online: state.online,
  user: getCurrentUser(state),
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
});

class DashboardScreen extends React.Component<Props> {
  static navigationOptions = ({navigation}) => {
    const params = navigation.state.params || {
      logout: () => {
      },
      online: false,
    };

    const headerLeft = !params.online
      ? <FontAwesome name="wifi" size={20} color={vars.ACCENT_RED} style={{marginLeft: 10}}/>
      : null;

    const headerRight = params.online
      ? <View>
        <Button
          onPress={() => {
            params.logout();
            navigation.navigate('Auth');
          }}
          title="Log out"
        />

      </View>
      : null;

    const title = 'Dashboard';

    return {
      title: title,
      headerLeft: headerLeft,
      headerRight: headerRight,
    };
  };

  componentWillMount() {
    this.props.navigation.setParams({logout: this.props.logout, online: this.props.online});
  }

  componentDidUpdate() {
    if (this.props.online !== this.props.navigation.getParam('online'))
      this.props.navigation.setParams({online: this.props.online});
  }

  render() {
    return <Dashboard {...this.props} edit={() => this.props.navigation.navigate('Edit')}/>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen);
