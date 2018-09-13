// @flow

import React from 'react';
import {connect} from 'react-redux';
import type {PrivateGroupObject, PublicGroupObject} from "../../model/group";
import {getObject} from "../../model";
import {FontAwesome} from '@expo/vector-icons';
import NavTitleContainer from "../../containers/NavTitleContainer";
import type {tabs} from "./UserList";
import UserList from "./UserList";
import {clearLastError, loadObject} from "../../actions";
import {propEqual} from "../../util";
import {isObjectSeen} from "../../model/user";
import type {navigation} from "../../nav";

type Props = {
  online: boolean,
  loading: boolean,
  group: PublicGroupObject,
  navigation: navigation,
  refresh: () => void,
}

type State = {
  tab: tabs,
}

const mapStateToProps = (state, props) => {
  const group: PrivateGroupObject = getObject(state, 'group', props.navigation.getParam('groupId'));

  return {
    online: state.flags.online,
    loading: state.flags.loading,
    group,
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  refresh: () => {
    dispatch(clearLastError());
    dispatch(loadObject('group', props.navigation.getParam('groupId'), false, true));
  },
});

class UserListScreen extends React.Component<Props, State> {
  static navigationOptions = ({navigation}) => ({
    headerTitle: <NavTitleContainer title={navigation.getParam('title', 'Loading...')}/>,
  });

  constructor(props: Props) {
    super(props);
    this.state = {
      tab: "followers",
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !propEqual(this.state, nextState, ['tab'])
      || !propEqual(this.props, nextProps, ['online', 'loading'], ['group']);
  }

  componentWillMount() {
    this.props.navigation.setParams({title: this.props.group.title});
    const tab = this.props.navigation.getParam('which', this.state.tab);
    if (this.state.tab !== tab)
      this.setState({tab: tab});
  }

  componentDidUpdate() {
    if (this.props.group.title !== this.props.navigation.getParam('title'))
      this.props.navigation.setParams({title: this.props.group.title});
  }

  render() {
    return <UserList {...this.props} tab={this.state.tab} changeTab={(tab: tabs) => this.setState({tab})}/>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserListScreen);
