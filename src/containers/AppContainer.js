// @flow

import React from 'react';
import {AppLoading} from 'expo';
import {connect} from 'react-redux';
import {changeOnlineStatus, initialize} from "../actions/index";
import {createBottomTabNavigator, createStackNavigator, createSwitchNavigator} from 'react-navigation';
import LoginScreen from "../screens/auth/LoginScreen";
import DashboardScreen from "../screens/user/DashboardScreen";
import EditScreen from "../screens/user/EditScreen";
import GroupScreen from "../screens/group/GroupScreen";
import {FontAwesome} from '@expo/vector-icons';
import vars from "../vars";
import TempBlankScreen from "../screens/TempBlankScreen";
import TempReportingScreen from "../screens/reporting/TempReportingScreen";

const AuthScreens = createStackNavigator({
  Login: LoginScreen,
});

const ExploreStack = createStackNavigator({
  Explore: TempBlankScreen,
  Group: GroupScreen,
});
const ChatStack = createSwitchNavigator({
  Chat: TempBlankScreen,
});
const ReportingStack = createSwitchNavigator({
  Reporting: TempReportingScreen,
});
const UserStack = createStackNavigator({
  Dashboard: DashboardScreen,
  Edit: EditScreen,
});

const TabScreens = createBottomTabNavigator({
  Explore: ExploreStack,
  Chat: ChatStack,
  Reporting: ReportingStack,
  User: UserStack,
}, {
  navigationOptions: ({navigation}) => ({
    tabBarIcon: ({focused, tintColor}) => {
      const {routeName} = navigation.state;

      const icons = {
        'Explore': "globe",
        'Chat': "comments",
        'Reporting': "paper-plane",
        'User': "user",
      };

      return <FontAwesome
        name={icons[routeName]} size={26} color={tintColor}
      />;
    },
    tabBarOptions: {
      activeTintColor: vars.SHELTER_RED,
      inactiveTintColor: vars.SHELTER_GREY,
    },
  }),
  initialRouteName2: 'User',
});

const MainNavigator = createSwitchNavigator(
  {
    Auth: AuthScreens,
    Tabs: TabScreens,
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
