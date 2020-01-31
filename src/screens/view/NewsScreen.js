// @flow

import React from 'react';
import {connect} from 'react-redux';
import type {PublicNewsObject} from "../../model/news";
import {detailLevels, getObject, OBJECT_MODE_PUBLIC} from "../../model";
import News from './News';
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
  news: PublicNewsObject,
  loaded: boolean,
  navigation: navigation,
  refresh: () => void,
  lastError: lastErrorType,
}

const mapStateToProps = (state, props) => {
  const news: PublicNewsObject = convertFiles(state, 'news', getObject(state, 'news', props.navigation.getParam('newsId')));

  return {
    online: state.flags.online,
    loading: state.flags.loading,
    lastError: state.lastError,
    news: news,
    loaded: detailLevels[news._mode] >= detailLevels[OBJECT_MODE_PUBLIC],
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  refresh: () => {
    dispatch(clearLastError());
    dispatch(loadObject('news', props.navigation.getParam('newsId'), false, true));
  },
});

class NewsScreen extends React.Component<Props> {
  static navigationOptions = {
    headerTitle: <NavTitleContainer title="News"/>,
  };

  shouldComponentUpdate(nextProps) {
    return !propEqual(this.props, nextProps, ['online', 'loading', 'loaded'], ['news', 'lastError']);
  }

  componentWillMount() {
    if (!this.props.loaded)
      this.props.refresh();
  }

  componentDidMount() {
    this.props.navigation.addListener(
      'didFocus',
      payload => hitPage(payload.state.routeName + '/' + this.props.news.id),
    );
  }

  render() {
    return <News {...this.props}/>;
  }
}

export default NewsScreen = connect(mapStateToProps, mapDispatchToProps)(NewsScreen);
