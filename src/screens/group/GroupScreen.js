// @flow

import React from 'react';
import {connect} from 'react-redux';
import type {PublicGroupObject} from "../../model/group";
import {getObject} from "../../model";
import {FontAwesome} from '@expo/vector-icons';
import vars from "../../vars";
import Group from './Group';
import type {FactsheetObject} from "../../model/factsheet";
import {FileSystem} from "expo";
import {loadObject} from "../../actions/index";
import {OBJECT_MODE_STUB} from "../../model/index";

type Props = {
  online: boolean,
  group: PublicGroupObject,
  loaded: boolean,
  navigation: { setParams: ({}) => {} },
  load: number => {},
  refresh: number => {},
}

const mapStateToProps = (state, props) => {
  const group: PublicGroupObject = getObject(state, 'group', props.navigation.getParam('groupId'));
  const factsheet: FactsheetObject | null = group.latest_factsheet ? getObject(state, 'factsheet', group.latest_factsheet) : null;

  if (factsheet)
    FileSystem.getInfoAsync(factsheet.image).then(info => {
      console.log('CAM fs', factsheet, info);
    });

  return {
    online: state.online,
    group: group,
    loaded: group._mode !== OBJECT_MODE_STUB,
    factsheet: factsheet,
  };
};

const mapDispatchToProps = dispatch => ({
  load: id => dispatch(loadObject('group', id, true, false)),
  refresh: id => dispatch(loadObject('group', id, true, true)),
});

class GroupScreen extends React.Component<Props> {
  static navigationOptions = ({navigation}) => {
    const params = navigation.state.params || {
      online: null,
    };

    const headerLeft = params.online === false
      ? <FontAwesome name="wifi" size={20} color={vars.ACCENT_RED} style={{marginLeft: 10}}/>
      : null;

    return {
      title: params.title,
      headerLeft: headerLeft,
    };
  };

  componentWillMount() {
    const groupId = this.props.navigation.getParam('groupId');
    if (!this.props.loaded) {
      try {
        this.props.refresh(groupId);
      } catch (e) {
        console.log('CC load ERR', groupId, e);
      }
    }

    this.props.navigation.setParams({
      online: this.props.online,
      title: this.props.group.title,
    });
  }

  componentDidUpdate() {
    if (this.props.online !== this.props.navigation.getParam('online'))
      this.props.navigation.setParams({online: this.props.online});
    if (this.props.group.title !== this.props.navigation.getParam('title'))
      this.props.navigation.setParams({title: this.props.group.title});
  }

  render() {
    return <Group {...this.props}/>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupScreen);
