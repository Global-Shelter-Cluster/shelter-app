// @flow

import React from 'react';
import {connect} from 'react-redux';
import type {PrivateGroupObject, PublicGroupObject} from "../../model/group";
import {getObject, isObjectSeen} from "../../model";
import NavTitleContainer from "../../containers/NavTitleContainer";
import type {tabs} from "./AlertList";
import AlertList from "./AlertList";
import {clearLastError, loadObject} from "../../actions";
import {propEqual} from "../../util";
import type {navigation} from "../../nav";
import analytics from "../../analytics";
import {PageHit} from "expo-analytics";

type Props = {
  online: boolean,
  loading: boolean,
  group: PublicGroupObject,
  seenAlerts: Array<number>,
  unseenAlerts: Array<number>,
  seenNews: Array<number>,
  unseenNews: Array<number>,
  navigation: navigation,
  refresh: () => void,
}

type State = {
  tab: tabs,
}

const mapStateToProps = (state, props) => {
  const group: PrivateGroupObject = getObject(state, 'group', props.navigation.getParam('groupId'));

  const seenAlerts: Array<number> = [];
  const unseenAlerts: Array<number> = [];
  if (group.alerts !== undefined)
    group.alerts.map(id => isObjectSeen(state, 'alert', id) ? seenAlerts.push(id) : unseenAlerts.push(id));

  const seenNews: Array<number> = [];
  const unseenNews: Array<number> = [];
  if (group.news !== undefined)
    group.news.map(id => isObjectSeen(state, 'news', id) ? seenNews.push(id) : unseenNews.push(id));

  return {
    online: state.flags.online,
    loading: state.flags.loading,
    group,
    seenAlerts,
    unseenAlerts,
    seenNews,
    unseenNews,
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

    let defaultTab = "alerts";
    if (props.group.alerts === undefined && props.group.news !== undefined)
      defaultTab = "news";

    this.state = {
      tab: defaultTab,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !propEqual(this.state, nextState, ['tab'])
      || !propEqual(this.props, nextProps, ['online', 'loading'], ['group', 'seenAlerts', 'unseenAlerts', 'seenNews', 'unseenNews']);
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
