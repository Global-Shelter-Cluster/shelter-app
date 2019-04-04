// @flow

import React from 'react';
import {connect} from 'react-redux';
import NavTitleContainer from "../../containers/NavTitleContainer";
import {getObject} from "../../model";
import type {GlobalObject} from "../../model/global";
import {GLOBAL_OBJECT_ID} from "../../model/global";
import {clearLastError, loadObject} from "../../actions";
import {propEqual} from "../../util";
import Error from "../../components/Error";
import Search from "./Search";
import type {navigation} from "../../nav";
import type {tabs} from "./Search";
import analytics from "../../analytics";
import {PageHit} from "expo-analytics";
import i18n from "../../i18n";

type Props = {
  online: boolean,
  loading: boolean,
  global: GlobalObject,
  navigation: navigation,
  refreshGlobal: () => {},
}

type State = {
  tab: tabs,
}

const mapStateToProps = state => ({
  online: state.flags.online,
  loading: state.flags.loading,
  global: getObject(state, 'global', GLOBAL_OBJECT_ID),
  currentLanguage: state.languages.currentLanguage
});

const mapDispatchToProps = dispatch => ({
  refreshGlobal: () => {
    dispatch(clearLastError());
    dispatch(loadObject('global', GLOBAL_OBJECT_ID, false, true));
  },
});

class SearchScreen extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <NavTitleContainer title={navigation.getParam('i18nTitle', i18n.t('Search'))}/>,
    };
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      tab: "documents",
      currentLanguage: props.currentLanguage,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !propEqual(this.state, nextState, ['tab'])
      || !propEqual(this.props, nextProps, ['online', 'loading'], ['global']);
  }

  componentWillMount() {
    const tab = this.props.navigation.getParam('which', this.state.tab);
    if (this.state.tab !== tab)
      this.setState({tab});
  }

  componentDidMount() {
    this.props.navigation.addListener(
      'didFocus',
      payload => {
        analytics.hit(new PageHit(payload.state.routeName))
        i18n.forceUpdate(this, 'Search');
      },
    );
  }

  render() {
    if (
      this.props.global.algolia_app_id === undefined
      || this.props.global.algolia_search_key === undefined
      || this.props.global.algolia_prefix === undefined
    )
      return <Error
        description={"Search is not enabled.\nPlease try again later."}
        buttonLabel={this.props.loading ? null : "Retry"} action={this.props.refreshGlobal}
      />;
    else if (!this.props.online)
      return <Error
        description={"You must be online\nfor search to work."}
      />;
    else
      return <Search {...this.props} tab={this.state.tab} changeTab={(tab: tabs) => this.setState({tab})}/>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);
