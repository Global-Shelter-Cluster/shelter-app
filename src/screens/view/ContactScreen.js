// @flow

import React from 'react';
import {connect} from 'react-redux';
import type {PublicContactObject} from "../../model/contact";
import {detailLevels, getObject, OBJECT_MODE_PUBLIC} from "../../model";
import Contact from './Contact';
import {clearLastError, loadObject} from "../../actions";
import NavTitleContainer from "../../containers/NavTitleContainer";
import type {lastErrorType} from "../../reducers/lastError";
import {convertFiles} from "../../model/file";
import {propEqual} from "../../util";
import type {navigation} from "../../nav";

type Props = {
  online: boolean,
  loading: boolean,
  contact: PublicContactObject,
  loaded: boolean,
  navigation: navigation,
  refresh: () => void,
  lastError: lastErrorType,
}

const mapStateToProps = (state, props) => {
  const contact: PublicContactObject = convertFiles(state, 'contact', getObject(state, 'contact', props.navigation.getParam('contactId')));

  return {
    online: state.flags.online,
    loading: state.flags.loading,
    lastError: state.lastError,
    contact: contact,
    loaded: detailLevels[contact._mode] >= detailLevels[OBJECT_MODE_PUBLIC],
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  refresh: () => {
    dispatch(clearLastError());
    dispatch(loadObject('contact', props.navigation.getParam('contactId'), false, true));
  },
});

class ContactScreen extends React.Component<Props> {
  static navigationOptions = {
    headerTitle: <NavTitleContainer title="Contact"/>,
  };

  shouldComponentUpdate(nextProps) {
    return !propEqual(this.props, nextProps, ['online', 'loading', 'loaded'], ['contact', 'lastError']);
  }

  componentWillMount() {
    if (!this.props.loaded)
      this.props.refresh();
  }

  render() {
    return <Contact {...this.props}/>;
  }
}

export default ContactScreen = connect(mapStateToProps, mapDispatchToProps)(ContactScreen);
