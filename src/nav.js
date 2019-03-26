// @flow

import React from "react";
import {
  createBottomTabNavigator,
  createStackNavigator,
  createSwitchNavigator,
  NavigationActions,
  createAppContainer
} from "react-navigation";
import { StyleSheet, Platform } from "react-native";
import TranslatedText from './components/TranslatedText';
import LoginScreen from "./screens/auth/LoginScreen";
import SignupScreen from "./screens/auth/SignupScreen";
import ForgotScreen from "./screens/auth/ForgotScreen";
import DashboardScreen from "./screens/user/DashboardScreen";
import SettingsScreen from "./screens/user/SettingsScreen";
import GroupScreen from "./screens/group/GroupScreen";
import OperationsScreen from "./screens/group/OperationsScreen";
import WebsiteViewerScreen from "./screens/misc/WebsiteViewerScreen";
import {FontAwesome} from '@expo/vector-icons';
import vars from "./vars";
import ResourcesGroupScreen from "./screens/group/ResourcesGroupScreen";
import ReportListScreen from "./screens/reporting/ReportListScreen";
import WebformScreen from "./screens/reporting/WebformScreen";
import DocumentListScreen from "./screens/group/DocumentListScreen";
import EventListScreen from "./screens/group/EventListScreen";
import DocumentScreen from "./screens/view/DocumentScreen";
import EventScreen from "./screens/view/EventScreen";
import FactsheetScreen from "./screens/view/FactsheetScreen";
import PhotoGalleryScreen from "./screens/view/PhotoGalleryScreen";
import ArbitraryLibraryScreen from "./screens/view/ArbitraryLibraryScreen";
import LibraryScreen from "./screens/view/LibraryScreen";
import SearchScreen from "./screens/search/SearchScreen";
import AlertListScreen from "./screens/group/AlertListScreen";
import ContactScreen from "./screens/view/ContactScreen";
import UserListScreen from "./screens/group/UserListScreen";
import UserScreen from "./screens/view/UserScreen";
import i18n from "./i18n";

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
  Library: LibraryScreen,
  AlertList: AlertListScreen,
  Contact: ContactScreen,
  UserList: UserListScreen,
  User: UserScreen,
  ReportList: ReportListScreen,
  Reporting: WebsiteViewerScreen,
  Webform: WebformScreen,
});
// const ChatStack = createSwitchNavigator({
//   Chat: TempBlankScreen,
// });
const ResourcesStack = createStackNavigator({
  ResourcesGroup: ResourcesGroupScreen,
});
const MeStack = createStackNavigator({
  Dashboard: DashboardScreen,
  Settings: SettingsScreen,
});
const SearchStack = createStackNavigator({
  Search: SearchScreen,
});

// tabBarLabel hidden on android because seem impossible to center
const TabScreens = createBottomTabNavigator({
  Me: {
    screen: MeStack,
    navigationOptions: {
      tabBarLabel: () => Platform.OS === 'android' ? null : <TranslatedText style={styles.tabLabel}  text="Me" />,
    },
  },
  Operations: {
    screen: OperationsStack,
    navigationOptions: {
      tabBarLabel: () => Platform.OS === 'android' ? null : <TranslatedText style={styles.tabLabel} text="Operations" />,
    },
  },
  // Chat: ChatStack, //TODO: hide this for now
  Resources: {
    screen: ResourcesStack,
    navigationOptions: {
      tabBarLabel: () => Platform.OS === 'android' ? null : <TranslatedText style={styles.tabLabel} text="Resources" />,
    },
  },
  Search: {
    screen: SearchStack,
    navigationOptions: {
      tabBarLabel: () => Platform.OS === 'android' ? null : <TranslatedText style={styles.tabLabel} text="Search" />,
    },
  },
}, {
  defaultNavigationOptions: ({navigation}) => ({

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

const styles = StyleSheet.create({
  tabLabel: {
    fontSize: 12,
  }
});

const MainNavigator = createSwitchNavigator(
  {
    Auth: AuthScreens,
    Tabs: TabScreens,
  }, {
    initialRouteName: 'Auth',
  }
);

export default createAppContainer(MainNavigator);

export type navigation = {
  push: (string, {}) => {},
  navigate: (string) => {},
  setParams: ({}) => {},
  getParam: (name: string, defaultValue?: string | null) => string | null,
}

let _navigator = null;
export const setTopNav = nav => {
  _navigator = nav;
};
const doWhenNavigatorExists = async myFunc => {
  const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  while (_navigator === null)
    await timeout(500);

  myFunc();
};
export const navService = {
  navigate: (routeName, params) => doWhenNavigatorExists(() => _navigator.dispatch(
    NavigationActions.navigate({routeName, params})
  ))
};
