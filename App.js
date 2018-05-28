import React from 'react';
import {StyleSheet, Text, View, WebView} from 'react-native';
import {AppLoading} from 'expo';

export default class App extends React.Component {
  state = {
    isReady: false,
  };

  async load() {
    function timeout(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    console.log('A');
    await timeout(3000);
    console.log('B');
  }

  render() {
    if (!this.state.isReady)
      return (
        <AppLoading startAsync={this.load}
                    onFinish={() => this.setState({isReady: true})}
                    onError={console.error}
        />
      );

    return (
      <View style={styles.container}>
        <Text>Mini-test with kobo toolbox form</Text>
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
