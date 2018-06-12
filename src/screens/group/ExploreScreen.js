// @flow

import React from 'react';
import {connect} from 'react-redux';
import {FontAwesome} from '@expo/vector-icons';
import NavTitleContainer from "../../containers/NavTitleContainer";
import type {tabs} from "./Explore";
import Explore from "./Explore";
import type {PrivateUserObject} from "../../model/user";
import {getCurrentUser} from "../../model/user";
import {getObject} from "../../model";
import {GLOBAL_OBJECT_ID} from "../../model/global";

type Props = {
  online: boolean,
  user: PrivateUserObject,
  navigation: { setParams: ({}) => {} },
}

type State = {
  tab: tabs,
}

const mapStateToProps = (state, props) => ({
  online: state.flags.online,
  user: getCurrentUser(state),
  global: getObject(state, 'global', GLOBAL_OBJECT_ID),
});

const mapDispatchToProps = dispatch => ({});

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
