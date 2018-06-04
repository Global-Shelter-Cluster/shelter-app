// @flow

import React from 'react';
import {connect} from 'react-redux';
import type {PublicGroupObject} from "../../model/group";
import {getObject} from "../../model";
import {FontAwesome} from '@expo/vector-icons';
import vars from "../../vars";
import Group from './Group';

type Props = {
  online: boolean,
  group: PublicGroupObject,
  navigation: { setParams: ({}) => {} },
}

const mapStateToProps = (state, props) => ({
  online: state.online,
  group: getObject(state, 'group', props.navigation.getParam('groupId')),
});

const mapDispatchToProps = dispatch => ({
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
