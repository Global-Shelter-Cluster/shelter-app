// @flow

import React from 'react';
import {NetInfo, StyleSheet, Text, View, WebView} from 'react-native';
import {AppLoading} from 'expo';
import {connect} from 'react-redux';
import TestContainer from '../containers/TestContainer';
import {changeOnlineStatus, initialize} from "../actions/index";

type Props = {
  dispatch: () => {},
}

class AppContainer extends React.Component<Props> {
  // state = {
  //   isReady: false,
  // };

  // Update "online" state based on device connection.
  // See https://facebook.github.io/react-native/docs/netinfo.html
  async componentDidMount() {
    const connectionInfoHandler = connectionInfo => this.props.setOnline(connectionInfo.type !== 'none');
    NetInfo.addEventListener('connectionChange', connectionInfoHandler);
    const connectionInfo = await NetInfo.getConnectionInfo();
    connectionInfoHandler(connectionInfo);
  }

  render() {
    console.log('initializing is', this.props.initializing);
    if (this.props.initializing)
      return (
        <AppLoading
          startAsync={this.props.initialize}
          onFinish={() => {}}
          onError={console.error}
        />
      );

    return (
      <View style={styles.container}>
        <Text>Mini-test with kobo toolbox form</Text>
        <TestContainer/>
        <WebView
          source={{uri: 'https://ee.humanitarianresponse.info/x/#XfkA2YFa'}}
          style={{marginTop: 20, backgroundColor: '#dff', height: 100, width: 400}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff8',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});

const mapStateToProps = state => ({initializing: state.initializing});

const mapDispatchToProps = dispatch => {
  return {
    initialize: () => dispatch(initialize()),
    setOnline: (isOnline: boolean) => dispatch(changeOnlineStatus(isOnline)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
