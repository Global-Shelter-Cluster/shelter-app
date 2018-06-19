// @flow

import React from 'react';
import {connect} from 'react-redux';
import type {PrivateUserObject} from "../../model/user";
import {getCurrentUser} from "../../model/user";
import Dashboard from './Dashboard';
import NavTitleContainer from "../../containers/NavTitleContainer";
import LogoutNavButtonContainer from "../../containers/LogoutNavButtonContainer";
import {clearLastError, loadCurrentUser} from "../../actions";
import {propEqual} from "../../util";

type Props = {
  user: PrivateUserObject,
  loading: boolean,
  refreshUser: () => {},
}

const mapStateToProps = state => ({
  user: getCurrentUser(state),
  loading: state.flags.loading,
});

const mapDispatchToProps = dispatch => ({
  refreshUser: () => {
    dispatch(clearLastError());
    dispatch(loadCurrentUser(false, true));
  },
});

class DashboardScreen extends React.Component<Props> {
  static navigationOptions = {
    headerTitle: <NavTitleContainer title="Dashboard"/>,
    headerRight: <LogoutNavButtonContainer/>,
  };

  shouldComponentUpdate(nextProps) {
    return !propEqual(this.props, nextProps, ['loading'], ['user']);
  }

  componentWillMount() {
    // this.props.navigation.push('Factsheet', {factsheetId: 13449}); //TODO: temporary!! redirects to an arbitrary screen, useful for development
  }

  render() {
    return <Dashboard {...this.props}/>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen);
