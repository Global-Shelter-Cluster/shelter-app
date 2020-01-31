// @flow

import React from 'react';
import {connect} from 'react-redux';
import {detailLevels, getObject, OBJECT_MODE_PUBLIC} from "../../model";
import {FontAwesome} from '@expo/vector-icons';
import NavTitleContainer from "../../containers/NavTitleContainer";
import Library from "./Library";
import {clearLastError, loadObject} from "../../actions";
import {propEqual} from "../../util";
import type {navigation} from "../../nav";
import {hitPage} from "../../analytics";
import type {PublicLibraryPageObject} from "../../model/page";
import type {lastErrorType} from "../../reducers/lastError";
import type {GlobalObject} from "../../model/global";
import {GLOBAL_OBJECT_ID} from "../../model/global";

type Props = {
  online: boolean,
  loading: boolean,
  page: PublicLibraryPageObject,
  loaded: boolean,
  global: GlobalObject,
  navigation: navigation,
  refresh: () => void,
  lastError: lastErrorType,
}

const mapStateToProps = (state, props) => {
  const page: PublicLibraryPageObject = getObject(state, 'page', props.navigation.getParam('pageId'));

  return {
    online: state.flags.online,
    loading: state.flags.loading,
    lastError: state.lastError,
    page,
    loaded: detailLevels[page._mode] >= detailLevels[OBJECT_MODE_PUBLIC],
    global: getObject(state, 'global', GLOBAL_OBJECT_ID),
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  refresh: () => {
    dispatch(clearLastError());
    dispatch(loadObject('page', props.navigation.getParam('pageId'), false, true));
  },
});

class LibraryScreen extends React.Component<Props, State> {
  static navigationOptions = {
    headerTitle: <NavTitleContainer title="Library"/>,
  };

  shouldComponentUpdate(nextProps) {
    return !propEqual(this.props, nextProps, ['online', 'loading', 'loaded'], ['page', 'lastError']);
  }

  componentWillMount() {
    if (!this.props.loaded)
      this.props.refresh();
  }

  componentDidMount() {
    this.props.navigation.addListener(
      'didFocus',
      payload => hitPage(payload.state.routeName + '/' + this.props.page.id),
    );
  }

  render() {
    return <Library {...this.props}/>;
  }
}

export default LibraryScreen = connect(mapStateToProps, mapDispatchToProps)(LibraryScreen);
