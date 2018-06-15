// @flow

import React from 'react';
import {connect} from 'react-redux';
import type {PublicEventObject} from "../../model/event";
import {detailLevels, getObject, OBJECT_MODE_PUBLIC} from "../../model";
import {FontAwesome} from '@expo/vector-icons';
import Event from './Event';
import {clearLastError, loadObject} from "../../actions";
import NavTitleContainer from "../../containers/NavTitleContainer";
import type {lastErrorType} from "../../reducers/lastError";
import {convertFiles} from "../../model/file";

type Props = {
  online: boolean,
  loading: boolean,
  event: PublicEventObject,
  loaded: boolean,
  navigation: { setParams: ({}) => {}, getParam: (string) => string },
  refresh: () => {},
  lastError: lastErrorType,
}

const mapStateToProps = (state, props) => {
  const event: PublicEventObject = convertFiles(state, 'event', getObject(state, 'event', props.navigation.getParam('eventId')));

  return {
    online: state.flags.online,
    loading: state.flags.loading,
    lastError: state.lastError,
    event: event,
    loaded: detailLevels[event._mode] >= detailLevels[OBJECT_MODE_PUBLIC],
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  refresh: () => {
    dispatch(clearLastError());
    dispatch(loadObject('event', props.navigation.getParam('eventId'), false, true));
  },
});

class EventScreen extends React.Component<Props> {
  static navigationOptions = {
    headerTitle: <NavTitleContainer title="Event"/>,
  };

  componentWillMount() {
    if (!this.props.loaded)
      this.props.refresh();
  }

  render() {
    return <Event {...this.props}/>;
  }
}

export default EventScreen = connect(mapStateToProps, mapDispatchToProps)(EventScreen);
