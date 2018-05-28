// @flow

import React from 'react';
import {NetInfo, StyleSheet, Text, View, WebView} from 'react-native';
// import {AppLoading} from 'expo';
import {connect} from 'react-redux';
import TestContainer from '../containers/TestContainer';
import {changeOnlineStatus} from "../actions/index";

type Props = {
  dispatch: () => {},
}

type State = {
  // isReady: boolean,
}

class App extends React.Component<Props, State> {
  // state = {
  //   isReady: false,
  // };

  // Update "online" state based on device connection.
  // See https://facebook.github.io/react-native/docs/netinfo.html
  async componentDidMount() {
    const connectionInfoHandler = connectionInfo => this.props.dispatch(changeOnlineStatus(connectionInfo.type !== 'none'));
    NetInfo.addEventListener('connectionChange', connectionInfoHandler);
    const connectionInfo = await NetInfo.getConnectionInfo();
    connectionInfoHandler(connectionInfo);
  }

  render() {
    // if (!this.state.isReady)
    //   return (
    //     <AppLoading
    //       startAsync={this.load}
    //       onFinish={() => this.setState({isReady: true})}
    //       onError={console.error}
    //     />
    //   );

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

export default connect()(App);
