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
import {hitPage} from "../../analytics";
import type {GlobalObject} from "../../model/global";
import type {tabs} from "./Group";
import i18n from "../../i18n";

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
  const global: GlobalObject = convertFiles(state, 'global', getObject(state, 'global', 1));
  if (!global.resources_id) {
    props.navigation.navigate('Operations');
    return {group:{},loading:true};
  }
  const group: PublicGroupObject = convertFiles(state, 'group', getObject(state, 'group', global.resources_id));
  return {
    online: state.flags.online,
    loading: state.flags.loading,
    lastError: state.lastError,
    group: group,
    loaded: detailLevels[group._mode] >= detailLevels[OBJECT_MODE_PUBLIC],
    areAllSubregionsCountries: areAllSubregionsCountries(state, group.id),
    currentLanguage: state.languages.currentLanguage,
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  refreshInternal: (id) => {
    dispatch(clearLastError());
    dispatch(loadObject('group', id, false, true));
  },
});

const mergeProps = (propsFromState, propsFromDispatch, props) => ({
  refresh: () => propsFromDispatch.refreshInternal(propsFromState.group.id),
  ...propsFromState,
  ...props,
});

class ResourcesGroupScreen extends React.Component<Props> {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <NavTitleContainer title={navigation.getParam('i18nTitle', i18n.t('Resources'))}/>,
    };
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      tab: "dashboard",
      currentLanguage: props.currentLanguage,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !propEqual(this.state, nextState, ['tab'])
      || !propEqual(this.props, nextProps, ['online', 'loading', 'loaded'], ['group', 'factsheet', 'lastError']);
  }

  generateSubtitle() {
    const ret = [];
    if (this.props.group.type !== undefined && getGroupTypeLabel(this.props.group))
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
      payload => {
        hitPage(payload.state.routeName + '/' + this.props.group.id);
        i18n.forceUpdate(this, 'Resources');
      },
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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ResourcesGroupScreen);
