// @flow

import React from 'react';
import {connect} from 'react-redux';
import type {UserObject} from "../../model/user";
import {detailLevels, getObject, OBJECT_MODE_PUBLIC} from "../../model";
import User from './User';
import {clearLastError, loadObject} from "../../actions";
import NavTitleContainer from "../../containers/NavTitleContainer";
import type {lastErrorType} from "../../reducers/lastError";
import {convertFiles} from "../../model/file";
import {propEqual} from "../../util";
import type {navigation} from "../../nav";

type Props = {
  online: boolean,
  loading: boolean,
  user: UserObject,
  loaded: boolean,
  navigation: navigation,
  refresh: () => void,
  lastError: lastErrorType,
}

const mapStateToProps = (state, props) => {
  const user: UserObject = convertFiles(state, 'user', getObject(state, 'user', props.navigation.getParam('userId')));

  return {
    online: state.flags.online,
    loading: state.flags.loading,
    lastError: state.lastError,
    user: user,
    loaded: detailLevels[user._mode] >= detailLevels[OBJECT_MODE_PUBLIC],
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  refresh: () => {
    dispatch(clearLastError());
    dispatch(loadObject('user', props.navigation.getParam('userId'), false, true));
  },
});

class UserScreen extends React.Component<Props> {
  static navigationOptions = {
    headerTitle: <NavTitleContainer title="User"/>,
  };

  shouldComponentUpdate(nextProps) {
    return !propEqual(this.props, nextProps, ['online', 'loading', 'loaded'], ['user', 'lastError']);
  }

  componentWillMount() {
    if (!this.props.loaded)
      this.props.refresh();
  }

  render() {
    return <User {...this.props}/>;
  }
}

export default UserScreen = connect(mapStateToProps, mapDispatchToProps)(UserScreen);
