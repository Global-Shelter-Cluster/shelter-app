import React from 'react';
import TestContainer from '../../containers/TestContainer';
import {Button, StyleSheet, View, WebView} from 'react-native';
import {logout} from "../../actions";
import {connect} from 'react-redux';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff8',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});

class DashboardScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    const params = navigation.state.params || {
      logout: () => {}
    };
    return {
      title: 'Dashboard',
      headerRight: <Button
        onPress={() => {
          params.logout();
          navigation.navigate('Auth');
        }}
        title="Log out"
      />
    };
  };

  componentWillMount() {
    this.props.navigation.setParams({logout: this.props.logout});
  }

  render() {
    return <View style={styles.container}>
      <TestContainer/>
      <WebView
        source={{uri: 'https://ee.humanitarianresponse.info/x/#XfkA2YFa'}}
        style={{marginTop: 20, backgroundColor: '#dff', height: 100, width: 400}}
      />
    </View>;
  }
}

const mapStateToProps = state => ({
  userData: state.user.data,
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen);
