// @flow

import React from 'react';
import {connect} from 'react-redux';
import type {PublicGroupObject} from "../../model/group";
import {areAllSubregionsCountries, getGroupTypeLabel} from "../../model/group";
import {detailLevels, getObject, OBJECT_MODE_PUBLIC} from "../../model";
import Group from './Group';
import type {FactsheetObject} from "../../model/factsheet";
import {clearLastError, loadObject} from "../../actions";
import NavTitleContainer from "../../containers/NavTitleContainer";
import type {lastErrorType} from "../../reducers/lastError";
import {convertFiles} from "../../model/file";
import {propEqual} from "../../util";
import type {navigation} from "../../nav";
import analytics from "../../analytics";
import {PageHit} from "expo-analytics";
import type {tabs} from "./Group";
import DocumentList from "./DocumentList";

type Props = {
  online: boolean,
  loading: boolean,
  group: PublicGroupObject,
  loaded: boolean,
  factsheet: FactsheetObject,
  navigation: navigation,
  refresh: () => void,
  lastError: lastErrorType,
}

type State = {
  tab: tabs,
}

const mapStateToProps = (state, props) => {
  const group: PublicGroupObject = convertFiles(state, 'group', getObject(state, 'group', props.navigation.getParam('groupId')));
  const factsheet: FactsheetObject | null = group.latest_factsheet ? getObject(state, 'factsheet', group.latest_factsheet) : null;

  return {
    online: state.flags.online,
    loading: state.flags.loading,
    lastError: state.lastError,
    group: group,
    loaded: detailLevels[group._mode] >= detailLevels[OBJECT_MODE_PUBLIC],
    factsheet: factsheet,
    areAllSubregionsCountries: areAllSubregionsCountries(state, group.id),
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  refresh: () => {
    dispatch(clearLastError());
    dispatch(loadObject('group', props.navigation.getParam('groupId'), false, true));
  },
});

class GroupScreen extends React.Component<Props, State> {
  static navigationOptions = ({navigation}) => ({
    headerTitle: <NavTitleContainer
      title={navigation.getParam('title', 'Loading...')}
      subtitle={navigation.getParam('subtitle', null)}
    />,
  });

  constructor(props: Props) {
    super(props);
    this.state = {
      tab: "dashboard",
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !propEqual(this.state, nextState, ['tab'])
      || !propEqual(this.props, nextProps, ['online', 'loading', 'loaded'], ['group', 'factsheet', 'lastError']);
  }

  generateSubtitle() {
    const ret = [];
    if (this.props.group.type !== undefined)
      ret.push(getGroupTypeLabel(this.props.group).toUpperCase());

    if (this.props.group.response_status !== undefined && this.props.group.response_status === 'archived')
      ret.push('archived');

    return ret.join(' • ');
  }

  componentWillMount() {
    if (!this.props.loaded)
      this.props.refresh();

    this.props.navigation.setParams({
      title: this.props.group.title,
      subtitle: this.generateSubtitle(),
    });

    const tab = this.props.navigation.getParam('which', this.state.tab);
    if (this.state.tab !== tab)
      this.setState({tab});
  }

  componentDidMount() {
    this.props.navigation.addListener(
      'didFocus',
      payload => analytics.hit(new PageHit(payload.state.routeName + '/' + this.props.group.id)),
    );
  }

  componentDidUpdate() {
    const subtitle = this.generateSubtitle();
    if (
      this.props.group.title !== this.props.navigation.getParam('title')
      || subtitle !== this.props.navigation.getParam('subtitle')
    ) {
      this.props.navigation.setParams({title: this.props.group.title, subtitle: subtitle});
    }
  }

  render() {
    return <Group {...this.props} tab={this.state.tab} changeTab={(tab: tabs) => this.setState({tab})}/>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupScreen);
