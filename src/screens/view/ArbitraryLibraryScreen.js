// @flow

import React from 'react';
import {connect} from 'react-redux';
import {detailLevels, getObject, OBJECT_MODE_PUBLIC} from "../../model";
import {FontAwesome} from '@expo/vector-icons';
import NavTitleContainer from "../../containers/NavTitleContainer";
import type {tabs} from "./ArbitraryLibrary";
import ArbitraryLibrary from "./ArbitraryLibrary";
import {clearLastError, loadObject} from "../../actions";
import {propEqual} from "../../util";
import type {navigation} from "../../nav";
import analytics from "../../analytics";
import {PageHit} from "expo-analytics";
import type {PublicArbitraryLibraryPageObject} from "../../model/page";
import type {lastErrorType} from "../../reducers/lastError";

type Props = {
  online: boolean,
  loading: boolean,
  page: PublicArbitraryLibraryPageObject,
  loaded: boolean,
  navigation: navigation,
  refresh: () => void,
  lastError: lastErrorType,
}

const mapStateToProps = (state, props) => {
  const page: PublicArbitraryLibraryPageObject = getObject(state, 'page', props.navigation.getParam('pageId'));

  return {
    online: state.flags.online,
    loading: state.flags.loading,
    lastError: state.lastError,
    page,
    loaded: detailLevels[page._mode] >= detailLevels[OBJECT_MODE_PUBLIC],
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  refresh: () => {
    dispatch(clearLastError());
    dispatch(loadObject('page', props.navigation.getParam('pageId'), false, true));
  },
});

class ArbitraryLibraryScreen extends React.Component<Props, State> {
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
      payload => analytics.hit(new PageHit(payload.state.routeName + '/' + this.props.page.id)),
    );
  }

  render() {
    return <ArbitraryLibrary {...this.props}/>;
  }
}

export default ArbitraryLibraryScreen = connect(mapStateToProps, mapDispatchToProps)(ArbitraryLibraryScreen);
