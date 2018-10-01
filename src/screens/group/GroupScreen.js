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

class GroupScreen extends React.Component<Props> {
  static navigationOptions = ({navigation}) => ({
    headerTitle: <NavTitleContainer
      title={navigation.getParam('title', 'Loading...')}
      subtitle={navigation.getParam('subtitle', null)}
    />,
  });

  shouldComponentUpdate(nextProps) {
    return !propEqual(this.props, nextProps, ['online', 'loading', 'loaded'], ['group', 'factsheet', 'lastError']);
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
    return <Group {...this.props}/>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupScreen);
