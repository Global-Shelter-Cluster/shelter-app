// @flow

import React from 'react';
import {AppLoading, Notifications} from 'expo';
import {connect} from 'react-redux';
import {clearNotification, initialize, setNotification} from "../actions";
import MainNavigator, {setTopNav} from '../nav';
import RootSiblings from 'react-native-root-siblings';
import NotificationContainer from "./NotificationContainer";
import store from "../store";
import Provider from "react-redux/es/components/Provider";
import {notificationEnter} from "../model/notification";

type Props = {
  dispatch: () => {},
  exp: { notification?: {} },
}

let navigation;

class AppContainer extends React.Component<Props> {
  componentDidMount() {
    // This makes notifications show as an overlay
    new RootSiblings(<Provider store={store}><NotificationContainer navigation={navigation}/></Provider>);

    // Handle push notifications
    const notificationListener = ({data, origin}) => {
      switch (origin) {
        case 'selected':
          this.props.setNotification(data);
          const state = store.getState();

          if (state.currentUser) {
            notificationEnter(state);
            this.props.clearNotification(data);
          }
          break;
        default:
          this.props.setNotification(data);
      }
    };

    Notifications.addListener(notificationListener);

    if (this.props.exp && this.props.exp.notification) {
      const doWhenInitializationEnds = async myFunc => {
        const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        while (this.props.initializing)
          await timeout(500);

        myFunc();
      };

      doWhenInitializationEnds(() => notificationListener(this.props.exp.notification));
    }
  };

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

    return <MainNavigator ref={setTopNav}/>;
  }
}

const mapStateToProps = state => ({
  initializing: state.flags.initializing,
});

const mapDispatchToProps = dispatch => {
  return {
    initialize: () => dispatch(initialize()),
    clearNotification: () => dispatch(clearNotification()),
    setNotification: notification => dispatch(setNotification(notification)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
