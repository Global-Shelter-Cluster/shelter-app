// @flow

import React from 'react';
import {AppLoading} from 'expo';
import {connect} from 'react-redux';
import {changeOnlineStatus, initialize} from "../actions/index";
import {createBottomTabNavigator, createStackNavigator, createSwitchNavigator} from 'react-navigation';
import LoginScreen from "../screens/auth/LoginScreen";
import DashboardScreen from "../screens/user/DashboardScreen";
import EditScreen from "../screens/user/EditScreen";
import vars from '../vars';

const AuthScreens = createStackNavigator({
  Login: LoginScreen,
});

const UserScreens = createStackNavigator({
  Dashboard: DashboardScreen,
  Edit: EditScreen,
}, {
  navigationOptions: {
    headerTintColor: vars.SHELTER_RED,
  },
});

const BrowseStack = createStackNavigator({
  Dashboard: DashboardScreen,
});
const ChatStack = createStackNavigator({
  Dashboard: DashboardScreen,
});
const ReportingStack = createStackNavigator({
  Dashboard: DashboardScreen,
});

const GroupScreens = createBottomTabNavigator({
  Browse: BrowseStack,
  Chat: ChatStack,
  Reporting: ReportingStack
}, {
  // tab config
});

const MainNavigator = createSwitchNavigator(
  {
    Auth: AuthScreens,
    User: UserScreens,
    Group: GroupScreens,
  }, {
    initialRouteName: 'Auth',
  }
);

type Props = {
  dispatch: () => {},
}

class AppContainer extends React.Component<Props> {
  render() {
    if (this.props.initializing)
      return (
        <AppLoading
          startAsync={this.props.initialize}
          onFinish={() => {
          }}
          onError={console.error}
        />
      );

    return <MainNavigator/>;
  }
}

const mapStateToProps = state => ({initializing: state.initializing});

const mapDispatchToProps = dispatch => {
  return {
    initialize: () => dispatch(initialize()),
    setOnline: (isOnline: boolean) => dispatch(changeOnlineStatus(isOnline)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
