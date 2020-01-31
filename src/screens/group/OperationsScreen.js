// @flow

import React from 'react';
import {connect} from 'react-redux';
import NavTitleContainer from "../../containers/NavTitleContainer";
import type {tabs} from "./Operations";
import Operations from "./Operations";
import type {PrivateUserObject} from "../../model/user";
import {getCurrentUser} from "../../model/user";
import {getObject} from "../../model";
import type {GlobalObject} from "../../model/global";
import {GLOBAL_OBJECT_ID} from "../../model/global";
import {clearLastError, loadCurrentUser, loadObject} from "../../actions";
import {propEqual} from "../../util";
import type {navigation} from "../../nav";
import {hitPage} from "../../analytics";
import LogoutNavButtonContainer from "../../containers/LogoutNavButtonContainer";
import TranslatedText from "../../components/TranslatedText";
import i18n from '../../i18n';

type Props = {
  online: boolean,
  loading: boolean,
  global: GlobalObject,
  user: PrivateUserObject,
  navigation: navigation,
  refreshGlobal: () => void,
  refreshUser: () => void,
}

type State = {
  tab: tabs,
}

const mapStateToProps = state => ({
  online: state.flags.online,
  loading: state.flags.loading,
  user: getCurrentUser(state),
  global: getObject(state, 'global', GLOBAL_OBJECT_ID),
  currentLanguage: state.languages.currentLanguage
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

class OperationsScreen extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <NavTitleContainer title={navigation.getParam('i18nTitle', i18n.t('Operations'))}/>,
    };
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      tab: "followed",
      currentLanguage: props.currentLanguage
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
    return !propEqual(this.state, nextState, ['tab'])
      || !propEqual(this.props, nextProps, ['online', 'loading'], ['user', 'global']);
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
        hitPage(payload.state.routeName + '/' + this.state.tab);
        i18n.forceUpdate(this, 'Operations');
      }
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.tab !== this.state.tab)
      hitPage(this.props.navigation.state.routeName + '/' + this.state.tab);
  }

  render() {
    return <Operations {...this.props} tab={this.state.tab} changeTab={(tab: tabs) => this.setState({tab})}/>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OperationsScreen);
