// @flow

import React from "react";
import {createBottomTabNavigator, createStackNavigator, createSwitchNavigator} from "react-navigation";
import LoginScreen from "./screens/auth/LoginScreen";
import DashboardScreen from "./screens/user/DashboardScreen";
import EditScreen from "./screens/user/EditScreen";
import GroupScreen from "./screens/group/GroupScreen";
import ExploreScreen from "./screens/group/ExploreScreen";
import WebsiteViewerScreen from "./screens/misc/WebsiteViewerScreen";
import {FontAwesome} from '@expo/vector-icons';
import vars from "./vars";
import TempBlankScreen from "./screens/TempBlankScreen";
import TempReportingScreen from "./screens/reporting/TempReportingScreen";
import DocumentListScreen from "./screens/group/DocumentListScreen";
import EventListScreen from "./screens/group/EventListScreen";
import DocumentScreen from "./screens/document/DocumentScreen";

const AuthScreens = createSwitchNavigator({
  Login: LoginScreen,
});

const ExploreStack = createStackNavigator({
  Explore: ExploreScreen,
  Group: GroupScreen,
  WebsiteViewer: WebsiteViewerScreen,
  DocumentList: DocumentListScreen,
  Document: DocumentScreen,
  EventList: EventListScreen,
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
const SearchStack = createStackNavigator({
  Search: TempBlankScreen,
});

const TabScreens = createBottomTabNavigator({
  Search: SearchStack,
  Explore: ExploreStack,
  Chat: ChatStack,
  Reporting: ReportingStack,
  User: UserStack,
}, {
  navigationOptions: ({navigation}) => ({
    tabBarIcon: ({focused, tintColor}) => {
      const {routeName} = navigation.state;

      const icons = {
        'Search': "search",
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
      inactiveTintColor: vars.MEDIUM_GREY,
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

export default MainNavigator;
