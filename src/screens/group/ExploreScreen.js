// @flow

import React from 'react';
import {connect} from 'react-redux';
import NavTitleContainer from "../../containers/NavTitleContainer";
import type {tabs} from "./Explore";
import Explore from "./Explore";
import type {PrivateUserObject} from "../../model/user";
import {getCurrentUser} from "../../model/user";
import {getObject} from "../../model";
import {GLOBAL_OBJECT_ID} from "../../model/global";
import {clearLastError, loadCurrentUser, loadObject} from "../../actions";
import {propEqual} from "../../util";

type Props = {
  online: boolean,
  loading: boolean,
  user: PrivateUserObject,
  navigation: { setParams: ({}) => {} },
  refreshGlobal: () => {},
  refreshUser: () => {},
}

type State = {
  tab: tabs,
}

const mapStateToProps = state => ({
  online: state.flags.online,
  loading: state.flags.loading,
  user: getCurrentUser(state),
  global: getObject(state, 'global', GLOBAL_OBJECT_ID),
});

const mapDispatchToProps = dispatch => ({
  refreshGlobal: () => {
    dispatch(clearLastError());
    dispatch(loadObject('global', GLOBAL_OBJECT_ID, false, true));
  },
  refreshUser: () => {
    dispatch(clearLastError());
    dispatch(loadCurrentUser(false, true));
  },
});

class ExploreScreen extends React.Component<Props, State> {
  static navigationOptions = {
    headerTitle: <NavTitleContainer title="Explore"/>,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      tab: "followed",
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !propEqual(this.state, nextState, ['tab'])
      || !propEqual(this.props, nextProps, ['online', 'loading'], ['user', 'global']);
  }

  componentWillMount() {
    const tab = this.props.navigation.getParam('which', this.state.tab);
    if (this.state.tab !== tab)
      this.setState({tab: tab});
  }

  render() {
    return <Explore {...this.props} tab={this.state.tab} changeTab={(tab: string) => this.setState({tab: tab})}/>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExploreScreen);
