// @flow

import React from 'react';
import {connect} from 'react-redux';
import type {PublicGroupObject} from "../../model/group";
import {getObject} from "../../model";
import {FontAwesome} from '@expo/vector-icons';
import Group from './Group';
import type {FactsheetObject} from "../../model/factsheet";
import {clearLastError, loadObject} from "../../actions/index";
import {OBJECT_MODE_STUB} from "../../model/index";
import NavTitleContainer from "../../containers/NavTitleContainer";
import type {lastErrorType} from "../../reducers/lastError";

type Props = {
  online: boolean,
  group: PublicGroupObject,
  loaded: boolean,
  factsheet: FactsheetObject,
  navigation: { setParams: ({}) => {} },
  load: number => {},
  refresh: number => {},
  lastError: lastErrorType,
}

const mapStateToProps = (state, props) => {
  const group: PublicGroupObject = getObject(state, 'group', props.navigation.getParam('groupId'));
  const factsheet: FactsheetObject | null = group.latest_factsheet ? getObject(state, 'factsheet', group.latest_factsheet) : null;

  // if (factsheet)
  //   FileSystem.getInfoAsync(factsheet.image).then(info => {
  //     console.log('CAM fs', factsheet, info);
  //   });

  return {
    online: state.online,
    lastError: state.lastError,
    group: group,
    loaded: group._mode !== OBJECT_MODE_STUB,
    factsheet: factsheet,
  };
};

const mapDispatchToProps = dispatch => ({
  load: id => dispatch(loadObject('group', id, true, false)),
  refresh: id => {
    dispatch(clearLastError());
    const action = loadObject('group', id, true, true);
    try {
      dispatch(action);
    } catch (e) {
      console.log('refresh err', e);
    }
    return action;
  },
});

class GroupScreen extends React.Component<Props> {
  static navigationOptions = ({navigation}) => ({
    headerTitle: <NavTitleContainer title={navigation.getParam('title', 'Loading...')}/>,
  });

  componentWillMount() {
    const groupId = this.props.navigation.getParam('groupId');
    if (!this.props.loaded)
      this.props.refresh(groupId);

    this.props.navigation.setParams({title: this.props.group.title});
  }

  componentDidUpdate() {
    if (this.props.group.title !== this.props.navigation.getParam('title'))
      this.props.navigation.setParams({title: this.props.group.title});
  }

  render() {
    return <Group {...this.props}/>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupScreen);
