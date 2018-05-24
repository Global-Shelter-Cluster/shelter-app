import React from 'react';
import { StyleSheet, Text, View, WebView } from 'react-native';

export default class App extends React.Component {
  render() {
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
