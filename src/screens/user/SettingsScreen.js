// @flow

import React from 'react';
import {connect} from 'react-redux';
import type {tabs} from "./Settings";
import Settings from './Settings';
import {
  clearLastError,
  getTranslations,
  loadCurrentUser,
  loadObject,
  refreshEnabledLanguages,
  saveLocalVars,
  updadeCurrentLanguage,
  updateUser
} from "../../actions";
import NavTitleContainer from "../../containers/NavTitleContainer";
import type {lastErrorType} from "../../reducers/lastError";
import {convertFiles} from "../../model/file";
import {propEqual} from "../../util";
import type {navigation} from "../../nav";
import {hitPage} from "../../analytics";
import type {PrivateUserObject} from "../../model/user";
import {getCurrentUser} from "../../model/user";
import type {localVarsType, localVarsTypeAllOptional} from "../../reducers/localVars";
import i18n from "../../i18n";
import {getObject} from "../../model";
import {GLOBAL_OBJECT_ID} from "../../model/global";
import clone from "clone";
import {ensurePermissions} from "../../permission";
import * as Permissions from "expo-permissions";

type Props = {
  online: boolean,
  loading: boolean,
  submitting: boolean,
  navigation: navigation,
  refresh: () => void,
  submit: (values: {}) => void,
  clearLastError: () => void,
  lastError: lastErrorType,
  user: PrivateUserObject,
  localVars: localVarsType,
}

type State = {
  tab: tabs,
  user: PrivateUserObject,
  localVars: localVarsType,
  hasCameraPermissions: boolean,
}

const initialState = {
  tab: "preferences",
  user: {},
  localVars: {},
};

const mapStateToProps = state => {
  const user: PrivateUserObject = convertFiles(state, 'user', getCurrentUser(state));
  // @TODO hoping that language is added to state.
  return {
    online: state.flags.online,
    loading: state.flags.loading,
    submitting: state.flags.submitting,
    lastError: state.lastError,
    global: getObject(state, 'global', GLOBAL_OBJECT_ID),
    user,
    localVars: state.localVars,
    enabledLanguages: state.languages.enabled,
    currentLanguage: state.languages.currentLanguage,
    languageOptions: state.languages.enabled,
    lastLocaleUpdate: state.appRemoteConfig.lastLocaleUpdate,
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  refreshUserInternal: async () => {
    dispatch(clearLastError());
    await dispatch(loadCurrentUser(false, true));
  },
  refreshGlobal: () => {
    dispatch(clearLastError());
    dispatch(loadObject('global', GLOBAL_OBJECT_ID, false, true));
  },
  submitLocalVars: (values: localVarsTypeAllOptional) => {
    dispatch(saveLocalVars(values));
  },
  clearLastError: () => {
    dispatch(clearLastError());
  },
  setLanguage: lang => dispatch(updadeCurrentLanguage(lang)),
  getTranslations: (lang, forceRefresh = false) => dispatch(getTranslations(lang, forceRefresh)),
  refreshEnabledLanguages: () => dispatch(refreshEnabledLanguages()),
  updateUserInternal: async values => dispatch(updateUser(values)),
});

class SettingsScreen extends React.Component<Props, State> {
  static navigationOptions = {
    headerTitle: <NavTitleContainer title={i18n.t("Settings")}/>,
  };

  constructor(props: Props) {
    super(props);
    this.state = initialState;
    this.state.localVars = props.localVars;
    this.state.user = props.user;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !propEqual(this.state, nextState, ['tab', 'hasCameraPermissions'], ['user', 'localVars'])
      || !propEqual(this.props, nextProps, ['online', 'loading', 'submitting'], ['user', 'localVars', 'lastError']);
  }

  componentDidMount() {
    this.props.navigation.addListener(
      'didFocus',
      payload => hitPage(payload.state.routeName),
    );
  }

  render() {
    return <Settings
      {...this.props}
      tab={this.state.tab}
      hasCameraPermissions={this.state.hasCameraPermissions}
      changeTab={async (tab: tabs) => {
        const partialState = {tab};

        if (tab === "user") {
          try {
            await ensurePermissions(Permissions.CAMERA_ROLL, Permissions.CAMERA);
            partialState.hasCameraPermissions = true;
          } catch (e) {
            partialState.hasCameraPermissions = false;
            console.warn(e);
            // TODO: maybe say something to the user and give them a chance to grant the camera/gallery permissions again
          }
        }

        this.setState(partialState);
      }}
      user={this.state.user}
      savedUser={this.props.user}
      localVars={this.state.localVars}
      onChangeLocalVars={this.props.submitLocalVars}
      navigation={this.props.navigation}
      updateLocalUser={values => {
        const user = Object.assign(clone(this.state.user), values);
        this.setState({user});
      }}
      refreshUser={async () => {
        await this.props.refreshUserInternal();
        this.setState({user: this.props.user}); // Put the loaded user object into state (i.e. the forms)
      }}
      updateUser={async values => {
        await this.props.updateUserInternal(values);
        this.setState({user: this.props.user}); // Put the loaded user object into state (i.e. the forms)
      }}
      discardUserChanges={() => this.setState({user: this.props.user})}
    />;
  }
}

export default SettingsScreen = connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
