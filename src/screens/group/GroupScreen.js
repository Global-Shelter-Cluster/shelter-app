// @flow

import React from 'react';
import {connect} from 'react-redux';
import type {PublicGroupObject} from "../../model/group";
import {detailLevels, getObject, OBJECT_MODE_PUBLIC} from "../../model";
import {FontAwesome} from '@expo/vector-icons';
import Group from './Group';
import type {FactsheetObject} from "../../model/factsheet";
import {clearLastError, loadObject} from "../../actions";
import NavTitleContainer from "../../containers/NavTitleContainer";
import type {lastErrorType} from "../../reducers/lastError";
import {convertFiles} from "../../model/file";
import {propEqual} from "../../util";

type Props = {
  online: boolean,
  loading: boolean,
  group: PublicGroupObject,
  loaded: boolean,
  factsheet: FactsheetObject,
  navigation: { setParams: ({}) => {}, getParam: (string) => string },
  refresh: () => {},
  lastError: lastErrorType,
}

const mapStateToProps = (state, props) => {
  const group: PublicGroupObject = convertFiles(state, 'group', getObject(state, 'group', props.navigation.getParam('groupId')));
  const factsheet: FactsheetObject | null = group.latest_factsheet ? getObject(state, 'factsheet', group.latest_factsheet) : null;

  // if (factsheet)
  //   FileSystem.getInfoAsync(factsheet.image).then(info => {
  //     console.log('CAM fs', factsheet, info);
  //   });

  return {
    online: state.flags.online,
    loading: state.flags.loading,
    lastError: state.lastError,
    group: group,
    loaded: detailLevels[group._mode] >= detailLevels[OBJECT_MODE_PUBLIC],
    factsheet: factsheet,
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  refresh: () => {
    dispatch(clearLastError());
    dispatch(loadObject('group', props.navigation.getParam('groupId'), false, true));
    // try {
    //   dispatch(action);
    // } catch (e) {
    //   console.log('refresh err', e);
    // }
    // return action;
  },
});

class GroupScreen extends React.Component<Props> {
  static navigationOptions = ({navigation}) => ({
    headerTitle: <NavTitleContainer title={navigation.getParam('title', 'Loading...')}/>,
  });

  shouldComponentUpdate(nextProps) {
    return !propEqual(this.props, nextProps, ['online', 'loading', 'loaded'], ['group', 'factsheet', 'lastError']);
  }

  componentWillMount() {
    if (!this.props.loaded)
      this.props.refresh();

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
