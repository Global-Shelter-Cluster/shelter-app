// @flow

import React from 'react';
import {connect} from 'react-redux';
import type {PrivateUserObject} from "../../model/user";
import {getCurrentUser} from "../../model/user";
import Dashboard from './Dashboard';
import {FontAwesome} from '@expo/vector-icons';
import NavTitleContainer from "../../containers/NavTitleContainer";
import LogoutNavButtonContainer from "../../containers/LogoutNavButtonContainer";

type Props = {
  user: PrivateUserObject,
}

const mapStateToProps = state => ({
  user: getCurrentUser(state),
});

const mapDispatchToProps = dispatch => ({});

class DashboardScreen extends React.Component<Props> {
  static navigationOptions = {
    headerTitle: <NavTitleContainer title="Dashboard"/>,
    headerRight: <LogoutNavButtonContainer/>,
  };

  render() {
    return <Dashboard {...this.props}/>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen);
