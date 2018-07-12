// @flow

import React from 'react';
import {connect} from 'react-redux';
import type {PublicDocumentObject} from "../../model/document";
import {detailLevels, getObject, OBJECT_MODE_PUBLIC} from "../../model";
import Document from './Document';
import {clearLastError, loadObject} from "../../actions";
import NavTitleContainer from "../../containers/NavTitleContainer";
import type {lastErrorType} from "../../reducers/lastError";
import {convertFiles} from "../../model/file";
import {propEqual} from "../../util";
import type {navigation} from "../../nav";

type Props = {
  online: boolean,
  loading: boolean,
  document: PublicDocumentObject,
  loaded: boolean,
  navigation: navigation,
  refresh: () => void,
  lastError: lastErrorType,
}

const mapStateToProps = (state, props) => {
  const document: PublicDocumentObject = convertFiles(state, 'document', getObject(state, 'document', props.navigation.getParam('documentId')));

  return {
    online: state.flags.online,
    loading: state.flags.loading,
    lastError: state.lastError,
    document: document,
    loaded: detailLevels[document._mode] >= detailLevels[OBJECT_MODE_PUBLIC],
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  refresh: () => {
    dispatch(clearLastError());
    dispatch(loadObject('document', props.navigation.getParam('documentId'), false, true));
  },
});

class DocumentScreen extends React.Component<Props> {
  static navigationOptions = {
    headerTitle: <NavTitleContainer title="Document"/>,
  };

  shouldComponentUpdate(nextProps) {
    return !propEqual(this.props, nextProps, ['online', 'loading', 'loaded'], ['document', 'lastError']);
  }

  componentWillMount() {
    if (!this.props.loaded)
      this.props.refresh();
  }

  render() {
    return <Document {...this.props}/>;
  }
}

export default DocumentScreen = connect(mapStateToProps, mapDispatchToProps)(DocumentScreen);
