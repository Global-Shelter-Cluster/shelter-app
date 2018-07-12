// @flow

import React from 'react';
import {connect} from 'react-redux';
import type {PrivateGroupObject} from "../../model/group";
import {getObject} from "../../model";
import {FontAwesome} from '@expo/vector-icons';
import NavTitleContainer from "../../containers/NavTitleContainer";
import ReportList from "./ReportList";
import {clearLastError, loadObject} from "../../actions";
import {propEqual} from "../../util";
import type {navigation} from "../../nav";

type Props = {
  loading: boolean,
  group: PrivateGroupObject,
  navigation: navigation,
  refresh: () => void,
}

const mapStateToProps = (state, props) => {
  const group: PrivateGroupObject = getObject(state, 'group', props.navigation.getParam('groupId'));
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

  shouldComponentUpdate(nextProps: Props) {
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
