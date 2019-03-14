// @flow

import React from 'react';
import {connect} from 'react-redux';
import type {tabs} from "./Settings";
import Settings from './Settings';
import {clearLastError, loadObject, saveLocalVars} from "../../actions";
import NavTitleContainer from "../../containers/NavTitleContainer";
import type {lastErrorType} from "../../reducers/lastError";
import {convertFiles} from "../../model/file";
import {propEqual} from "../../util";
import type {navigation} from "../../nav";
import analytics from "../../analytics";
import {PageHit} from "expo-analytics";
import type {PrivateUserObject} from "../../model/user";
import {getCurrentUser} from "../../model/user";
import type {localVarsType, localVarsTypeAllOptional} from "../../reducers/localVars";

type Props = {
  online: boolean,
  loading: boolean,
  submitting: boolean,
  navigation: navigation,
  refresh: () => void,
  submit: (values: {}) => void,
  clearLastError: () => void,
  lastError: lastErrorType,
  user: PrivateUserObject,
  localVars: localVarsType,
}

type State = {
  tab: tabs,
  user: PrivateUserObject,
  localVars: localVarsType,
}

const initialState = {
  tab: "preferences",
  user: {},
  localVars: {},
};

const mapStateToProps = state => {
  const user: PrivateUserObject = convertFiles(state, 'user', getCurrentUser(state));
  // @TODO hoping that language is added to state.
  return {
    online: state.flags.online,
    loading: state.flags.loading,
    submitting: state.flags.submitting,
    lastError: state.lastError,
    user,
    localVars: state.localVars,
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  refresh: () => {
    dispatch(clearLastError());
    dispatch(loadObject('webform', props.navigation.getParam('webformId'), false, true));
  },
  submitLocalVars: (values: localVarsTypeAllOptional) => {
    dispatch(saveLocalVars(values));
  },
  clearLastError: () => {
    dispatch(clearLastError());
  },
});

class SettingsScreen extends React.Component<Props, State> {
  static navigationOptions = {
    headerTitle: <NavTitleContainer title="Settings"/>,
  };

  constructor(props: Props) {
    super(props);
    this.state = initialState;
    this.state.user = props.user;
    this.state.localVars = props.localVars;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !propEqual(this.state, nextState, ['tab'], ['user', 'localVars'])
      || !propEqual(this.props, nextProps, ['online', 'loading', 'submitting'], ['user', 'localVars', 'lastError']);
  }

  componentDidMount() {
    this.props.navigation.addListener(
      'didFocus',
      payload => analytics.hit(new PageHit(payload.state.routeName)),
    );
  }

  render() {
    return <Settings
      {...this.props}
      tab={this.state.tab}
      changeTab={(tab: tabs) => this.setState({tab})}
      user={this.state.user}
      localVars={this.state.localVars}
      onChangeLocalVars={this.props.submitLocalVars}
    />;
  }
}

export default SettingsScreen = connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
