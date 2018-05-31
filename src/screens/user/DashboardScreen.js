// @flow

import React from 'react';
import TestContainer from '../../containers/TestContainer';
import {Button, StyleSheet, Text, View, WebView} from 'react-native';
import {logout} from "../../actions";
import {connect} from 'react-redux';
import type {UserObject} from "../../model/user";
import {getCurrentUser} from "../../model/user";
import {getUserGroups} from "../../model/group";
import type {GroupObject} from "../../model/group";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff8',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});

type Props = {
  user: UserObject,
  groups: Array<GroupObject>,
  navigation: { setParams: ({}) => {} },
  logout: () => {},
}

class DashboardScreen extends React.Component<Props> {
  static navigationOptions = ({navigation}) => {
    const params = navigation.state.params || {
      logout: () => {
      }
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
      <Text>{this.props.user.name}</Text>
      <Text>groups: {JSON.stringify(this.props.groups)}</Text>
      <TestContainer/>
      <WebView
        source={{uri: 'https://ee.humanitarianresponse.info/x/#XfkA2YFa'}}
        style={{marginTop: 20, backgroundColor: '#dff', height: 100, width: 400}}
      />
    </View>;
  }
}

const mapStateToProps = state => {
  const followedGroups = [];

  return {
    user: getCurrentUser(state),
    groups: getUserGroups(state),
    followedGroups
  }
};

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen);
