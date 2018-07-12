// @flow

import React from 'react';
import {connect} from 'react-redux';
import {getCurrentUser} from "../../model/user";
import ReportGroups from './ReportGroups';
import NavTitleContainer from "../../containers/NavTitleContainer";
import {clearLastError, loadCurrentUser} from "../../actions";
import {propEqual} from "../../util";
import {getObject} from "../../model";

type Props = {
  groups: Array<number>,
  loading: boolean,
  refresh: () => void,
}

const mapStateToProps = state => {
  const user = getCurrentUser(state);

  return {
    groups: user.groups === undefined ? [] : user.groups.filter(id => {
      const group = getObject(state, 'group', id);
      return group.kobo_forms !== undefined;
    }),
    loading: state.flags.loading,
  };
};

const mapDispatchToProps = dispatch => ({
  refresh: () => {
    dispatch(clearLastError());
    dispatch(loadCurrentUser(false, true));
  },
});

class ReportGroupsScreen extends React.Component<Props> {
  static navigationOptions = {
    headerTitle: <NavTitleContainer title="Reporting"/>,
  };

  shouldComponentUpdate(nextProps) {
    return !propEqual(this.props, nextProps, ['loading'], ['user']);
  }

  render() {
    return <ReportGroups {...this.props}/>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportGroupsScreen);
