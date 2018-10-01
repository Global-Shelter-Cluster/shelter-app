// @flow

import React from 'react';
import {connect} from 'react-redux';
import type {PrivateGroupObject, PublicGroupObject} from "../../model/group";
import {getObject} from "../../model";
import {FontAwesome} from '@expo/vector-icons';
import NavTitleContainer from "../../containers/NavTitleContainer";
import type {tabs} from "./AlertList";
import AlertList from "./AlertList";
import {clearLastError, loadObject} from "../../actions";
import {propEqual} from "../../util";
import {isObjectSeen} from "../../model/alert";
import type {navigation} from "../../nav";
import analytics from "../../analytics";
import {PageHit} from "expo-analytics";

type Props = {
  online: boolean,
  loading: boolean,
  group: PublicGroupObject,
  seen: Array<number>,
  unseen: Array<number>,
  navigation: navigation,
  refresh: () => void,
}

type State = {
  tab: tabs,
}

const mapStateToProps = (state, props) => {
  const group: PrivateGroupObject = getObject(state, 'group', props.navigation.getParam('groupId'));

  const seen: Array<number> = [];
  const unseen: Array<number> = [];

  if (group.alerts !== undefined)
    group.alerts.map(id => isObjectSeen(state, 'alert', id) ? seen.push(id) : unseen.push(id));

  return {
    online: state.flags.online,
    loading: state.flags.loading,
    group,
    seen,
    unseen,
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  refresh: () => {
    dispatch(clearLastError());
    dispatch(loadObject('group', props.navigation.getParam('groupId'), false, true));
  },
});

class AlertListScreen extends React.Component<Props, State> {
  static navigationOptions = ({navigation}) => ({
    headerTitle: <NavTitleContainer title={navigation.getParam('title', 'Loading...')}/>,
  });

  constructor(props: Props) {
    super(props);
    this.state = {
      tab: "new",
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !propEqual(this.state, nextState, ['tab'])
      || !propEqual(this.props, nextProps, ['online', 'loading'], ['group', 'seen', 'unseen']);
  }

  componentWillMount() {
    this.props.navigation.setParams({title: this.props.group.title});
    const tab = this.props.navigation.getParam('which', this.state.tab);
    if (this.state.tab !== tab)
      this.setState({tab: tab});
  }

  componentDidMount() {
    this.props.navigation.addListener(
      'didFocus',
      payload => analytics.hit(new PageHit(payload.state.routeName + '/' + this.props.group.id)),
    );
  }

  componentDidUpdate() {
    if (this.props.group.title !== this.props.navigation.getParam('title'))
      this.props.navigation.setParams({title: this.props.group.title});
  }

  render() {
    return <AlertList {...this.props} tab={this.state.tab} changeTab={(tab: tabs) => this.setState({tab})}/>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AlertListScreen);
