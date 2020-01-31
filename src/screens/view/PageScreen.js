// @flow

import React from 'react';
import {connect} from 'react-redux';
import type {PublicPageObject} from "../../model/page";
import {detailLevels, getObject, OBJECT_MODE_PUBLIC} from "../../model";
import Page from './Page';
import {clearLastError, loadObject} from "../../actions";
import NavTitleContainer from "../../containers/NavTitleContainer";
import type {lastErrorType} from "../../reducers/lastError";
import {convertFiles} from "../../model/file";
import {propEqual} from "../../util";
import type {navigation} from "../../nav";
import {hitPage} from "../../analytics";

type Props = {
  online: boolean,
  loading: boolean,
  page: PublicPageObject,
  loaded: boolean,
  navigation: navigation,
  refresh: () => void,
  lastError: lastErrorType,
}

const mapStateToProps = (state, props) => {
  const page: PublicPageObject = convertFiles(state, 'page', getObject(state, 'page', props.navigation.getParam('pageId')));

  return {
    online: state.flags.online,
    loading: state.flags.loading,
    lastError: state.lastError,
    page: page,
    loaded: detailLevels[page._mode] >= detailLevels[OBJECT_MODE_PUBLIC],
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  refresh: () => {
    dispatch(clearLastError());
    dispatch(loadObject('page', props.navigation.getParam('pageId'), false, true));
  },
});

class PageScreen extends React.Component<Props> {
  static navigationOptions = {
    headerTitle: <NavTitleContainer title="Page"/>,
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
    return <Page {...this.props}/>;
  }
}

export default PageScreen = connect(mapStateToProps, mapDispatchToProps)(PageScreen);
