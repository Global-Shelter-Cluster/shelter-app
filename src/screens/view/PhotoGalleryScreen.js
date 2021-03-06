// @flow

import React from 'react';
import {connect} from 'react-redux';
import {detailLevels, getObject, OBJECT_MODE_PUBLIC} from "../../model";
import PhotoGallery from './PhotoGallery';
import {clearLastError, loadObject} from "../../actions";
import NavTitleContainer from "../../containers/NavTitleContainer";
import type {lastErrorType} from "../../reducers/lastError";
import {convertFiles} from "../../model/file";
import {propEqual} from "../../util";
import type {navigation} from "../../nav";
import analytics from "../../analytics";
import {PageHit} from "expo-analytics";
import type {PublicPhotoGalleryPageObject} from "../../model/page";

type Props = {
  online: boolean,
  loading: boolean,
  page: PublicPhotoGalleryPageObject,
  loaded: boolean,
  navigation: navigation,
  refresh: () => void,
  lastError: lastErrorType,
}

const mapStateToProps = (state, props) => {
  const page: PublicPhotoGalleryPageObject = convertFiles(state, 'page', getObject(state, 'page', props.navigation.getParam('pageId')));

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

class PhotoGalleryScreen extends React.Component<Props> {
  static navigationOptions = {
    headerTitle: <NavTitleContainer title="Photo gallery"/>,
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
    return <PhotoGallery {...this.props}/>;
  }
}

export default PhotoGalleryScreen = connect(mapStateToProps, mapDispatchToProps)(PhotoGalleryScreen);
