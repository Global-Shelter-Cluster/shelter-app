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
import DocumentList from "./DocumentList";

type Props = {
  online: boolean,
  group: PublicGroupObject,
  which: "recent" | "featured" | "key",
  navigation: { setParams: ({}) => {} },
}

const mapStateToProps = (state, props) => {
  const group: PublicGroupObject = getObject(state, 'group', props.navigation.getParam('groupId'));

  return {
    online: state.flags.online,
    group: group,
    which: props.navigation.getParam('which', 'recent'),
  };
};

const mapDispatchToProps = dispatch => ({
});

class DocumentListScreen extends React.Component<Props> {
  static navigationOptions = ({navigation}) => ({
    headerTitle: <NavTitleContainer title={navigation.getParam('title', 'Loading...')}/>,
  });

  componentWillMount() {
    this.props.navigation.setParams({title: this.props.group.title});
  }

  componentDidUpdate() {
    if (this.props.group.title !== this.props.navigation.getParam('title'))
      this.props.navigation.setParams({title: this.props.group.title});
  }

  render() {
    return <DocumentList {...this.props}/>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentListScreen);
