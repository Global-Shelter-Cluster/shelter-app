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
import analytics from "../../analytics";
import {PageHit} from "expo-analytics";
import type {AssessmentFormType} from "../../persist";
import i18n from "../../i18n";
import TranslatedText from "../../components/TranslatedText";

type Props = {
  loading: boolean,
  queuedFormSubmissions: Array<{ type: AssessmentFormType, id: number, count: number }>,
  user: PrivateUserObject,
  unseenAlerts: Array<number>,
  refresh: () => void,
}

const mapStateToProps = state => {
  const queuedFormSubmissions = {};

  for (const submission of state.bgProgress.assessmentFormSubmissions) {
    const key = submission.type + ':' + submission.id;
    if (queuedFormSubmissions[key] === undefined)
      queuedFormSubmissions[key] = {type: submission.type, id: submission.id, count: 0};

    queuedFormSubmissions[key].count++;
  }

  return {
    loading: state.flags.loading,
    queuedFormSubmissions: Object.values(queuedFormSubmissions),
    user: getCurrentUser(state),
    unseenAlerts: getUnseenAlertIds(state),
  };
};

const mapDispatchToProps = dispatch => ({
  refresh: () => {
    dispatch(clearLastError());
    dispatch(loadCurrentUser(false, true));
  },
});

class DashboardScreen extends React.Component<Props> {
  static navigationOptions = () => {
    return {
      headerTitle: <NavTitleContainer title={i18n.t("Dashboard")}/>,
      headerRight: <LogoutNavButtonContainer/>,
    }
  };

  shouldComponentUpdate(nextProps) {
    return !propEqual(this.props, nextProps, ['loading'], ['queuedFormSubmissions', 'user', 'unseenAlerts']);
  }

  componentWillMount() {
    // this.props.navigation.push('Factsheet', {factsheetId: 13449}); //TODO: temporary!! redirects to an arbitrary screen, useful for development
  }

  componentDidMount() {
    this.props.navigation.addListener(
      'didFocus',
      payload => analytics.hit(new PageHit(payload.state.routeName)),
    );
  }

  render() {
    return <Dashboard {...this.props}/>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen);
