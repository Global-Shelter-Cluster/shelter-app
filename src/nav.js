// @flow

import React from "react";
import {createBottomTabNavigator, createStackNavigator, createSwitchNavigator} from "react-navigation";
import LoginScreen from "./screens/auth/LoginScreen";
import SignupScreen from "./screens/auth/SignupScreen";
import ForgotScreen from "./screens/auth/ForgotScreen";
import DashboardScreen from "./screens/user/DashboardScreen";
import EditScreen from "./screens/user/EditScreen";
import GroupScreen from "./screens/group/GroupScreen";
import OperationsScreen from "./screens/group/OperationsScreen";
import WebsiteViewerScreen from "./screens/misc/WebsiteViewerScreen";
import {FontAwesome} from '@expo/vector-icons';
import vars from "./vars";
import ResourcesGroupScreen from "./screens/group/ResourcesGroupScreen";
import ReportListScreen from "./screens/reporting/ReportListScreen";
import DocumentListScreen from "./screens/group/DocumentListScreen";
import EventListScreen from "./screens/group/EventListScreen";
import DocumentScreen from "./screens/view/DocumentScreen";
import EventScreen from "./screens/view/EventScreen";
import FactsheetScreen from "./screens/view/FactsheetScreen";
import PhotoGalleryScreen from "./screens/view/PhotoGalleryScreen";
import ArbitraryLibraryScreen from "./screens/view/ArbitraryLibraryScreen";
import SearchScreen from "./screens/search/SearchScreen";
import AlertListScreen from "./screens/group/AlertListScreen";
import ContactScreen from "./screens/view/ContactScreen";
import UserListScreen from "./screens/group/UserListScreen";
import UserScreen from "./screens/view/UserScreen";
import analytics from "./analytics";

const AuthScreens = createSwitchNavigator({
  Login: LoginScreen,
  Signup: SignupScreen,
  Forgot: ForgotScreen,
});

const OperationsStack = createStackNavigator({
  Operations: OperationsScreen,
  Group: GroupScreen,
  WebsiteViewer: WebsiteViewerScreen,
  DocumentList: DocumentListScreen,
  Document: DocumentScreen,
  EventList: EventListScreen,
  Event: EventScreen,
  Factsheet: FactsheetScreen,
  PhotoGallery: PhotoGalleryScreen,
  ArbitraryLibrary: ArbitraryLibraryScreen,
  AlertList: AlertListScreen,
  Contact: ContactScreen,
  UserList: UserListScreen,
  User: UserScreen,
  ReportList: ReportListScreen,
  Reporting: WebsiteViewerScreen,
});
// const ChatStack = createSwitchNavigator({
//   Chat: TempBlankScreen,
// });
const ResourcesStack = createStackNavigator({
  ResourcesGroup: ResourcesGroupScreen,
});
const MeStack = createStackNavigator({
  Dashboard: DashboardScreen,
  Edit: EditScreen,
});
const SearchStack = createStackNavigator({
  Search: SearchScreen,
});

const TabScreens = createBottomTabNavigator({
  Me: {
    screen: MeStack,
    navigationOptions: {
      tabBarLabel: "User",
    },
  },
  Operations: OperationsStack,
  // Chat: ChatStack, //TODO: hide this for now
  Resources: ResourcesStack,
  Search: SearchStack,
}, {
  navigationOptions: ({navigation}) => ({
    tabBarIcon: ({focused, tintColor}) => {
      const {routeName} = navigation.state;

      const icons = {
        'Search': "search",
        'Operations': "globe",
        'Chat': "comments",
        'Resources': "cogs",
        'Me': "user",
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

export type navigation = {
  push: (string, {}) => {},
  navigate: (string) => {},
  setParams: ({}) => {},
  getParam: (name: string, defaultValue?: string | null) => string | null,
}
