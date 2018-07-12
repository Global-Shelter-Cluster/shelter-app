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
import {getUnseenAlertIds} from "../../model/alert";

type Props = {
  loading: boolean,
  user: PrivateUserObject,
  unseenAlerts: Array<number>,
  refresh: () => void,
}

const mapStateToProps = state => ({
  loading: state.flags.loading,
  user: getCurrentUser(state),
  unseenAlerts: getUnseenAlertIds(state),
});

const mapDispatchToProps = dispatch => ({
  refresh: () => {
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
    return !propEqual(this.props, nextProps, ['loading'], ['user', 'unseenAlerts']);
  }

  componentWillMount() {
    // this.props.navigation.push('Factsheet', {factsheetId: 13449}); //TODO: temporary!! redirects to an arbitrary screen, useful for development
  }

  render() {
    return <Dashboard {...this.props}/>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen);
