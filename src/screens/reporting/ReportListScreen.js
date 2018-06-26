// @flow

import React from 'react';
import {connect} from 'react-redux';
import type {PublicGroupObject} from "../../model/group";
import {getObject} from "../../model";
import {FontAwesome} from '@expo/vector-icons';
import NavTitleContainer from "../../containers/NavTitleContainer";
import ReportList from "./ReportList";
import {clearLastError, loadObject} from "../../actions";
import {propEqual} from "../../util";

type Props = {
  loading: boolean,
  group: PublicGroupObject,
  navigation: { setParams: ({}) => {} },
  refresh: () => {},
}

const mapStateToProps = (state, props) => {
  const group: PublicGroupObject = getObject(state, 'group', props.navigation.getParam('groupId'));
  return {
    loading: state.flags.loading,
    group: group,
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  refresh: () => {
    dispatch(clearLastError());
    dispatch(loadObject('group', props.navigation.getParam('groupId'), false, true));
  },
});

class ReportListScreen extends React.Component<Props> {
  static navigationOptions = ({navigation}) => ({
    headerTitle: <NavTitleContainer title={navigation.getParam('title', 'Loading...')}/>,
  });

  shouldComponentUpdate(nextProps, nextState) {
    return !propEqual(this.props, nextProps, ['online', 'loading'], ['group']);
  }

  componentWillMount() {
    this.props.navigation.setParams({title: this.props.group.title});
  }

  componentDidUpdate() {
    if (this.props.group.title !== this.props.navigation.getParam('title'))
      this.props.navigation.setParams({title: this.props.group.title});
  }

  render() {
    return <ReportList {...this.props}/>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportListScreen);
