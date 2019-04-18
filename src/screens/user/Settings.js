// @flow
import React from 'react';
import {FlatList, RefreshControl, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View} from 'react-native';
import {NavigationActions, StackActions} from 'react-navigation';
import ModalSelector from 'react-native-modal-selector'
import type {tabsDefinition} from "../../components/Tabs";
import {formStylesheet} from "../../styles/formStyles";
import t from "tcomb-form-native";
import type {localVarsType} from "../../reducers/localVars";
import Button from "../../components/Button";
import {propEqual} from "../../util";
import type {lastErrorType} from "../../reducers/lastError";
import equal from "deep-equal";
import MultiLineButton from "../../components/MultiLineButton";
import type {PrivateUserObject} from "../../model/user";
import singleRowCheckbox from "../../styles/singleRowCheckbox";
import config from "../../config";
import connect from "react-redux/es/connect/connect";
import {getTranslations, refreshEnabledLanguages, updadeCurrentLanguage} from "../../actions";
import TranslatedText from "../../components/TranslatedText";
import MultiselectFactory from "../../components/tcomb/MultiselectFactory";
import i18n from "../../i18n";
import {FontAwesome} from '@expo/vector-icons';
import vars from "../../vars";
import MultiSelect from "../../components/Multiselect";
import persist from "../../persist";
import timezones from "../../timezones";

const Form = t.form.Form;

export type tabs = "user" | "preferences";

const languageModel = t.struct({
  languages: t.list(t.String)
});

type Props = {
  online: boolean,
  loading: boolean,
  tab: tabs,
  changeTab: (tab: tabs) => void,
  lastError: lastErrorType,

  user: PrivateUserObject,
  refreshUser: () => void,

  localVars: localVarsType,
  // submitLocalVars: () => void,
  onChangeLocalVars: () => void,

  enabledLanguages: {},
  currentLanguage: String,
  currentTimezone: String,
  languageOptions: [],
  lastDrupalLanguageUpdate: String,
}

type State = {
  languageValue: string,
  languageOptionsOld: {},
  languageOptions: [],
  _languageForm: () => void,
  isVisible: boolean
};

class Settings extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      languageValue: props.currentLanguage,
      languageOptionsOld: {
        fields: {
          languages: {
            label: <TranslatedText>Select your language</TranslatedText>,
            single: true,
            choices: this.props.languageOptions,
            factory: MultiselectFactory,
            config: {},
          }
        }
      },
      isVisible: true,
      languageOptions: [],
      _languageForm: () => {
      },
    };
  }

  async componentWillMount() {
    const hasChanged = await persist.remoteConfigHasChanged('lastLocaleUpdate', this.props.lastLocaleUpdate);
    if (hasChanged) {
      await this._onRefreshLanguages();
    }
  }

  shouldComponentUpdate(nextProps: Props) {
    return !propEqual(this.props, nextProps, ['online', 'loading', 'tab', 'currentLanguage'], ['user', 'localVars', 'lastError']);
  }

  _onPress = async (language) => {
    this.props.setLanguage(language);
    await this.props.getTranslations(language);
    persist.updateUser({ language }).catch((e) => console.log(e));
    this.resetNav();
  }

  _onTimezone = async (tz) => {
    persist.updateUser({ timezone: tz.label }).catch((e) => console.log(e));
  }

  resetNav = () => {
    // Reset the navigation and navigating away will show the selected translation.
    const resetAction = StackActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({routeName: 'Dashboard'}),
        NavigationActions.navigate({routeName: 'Settings'}),
      ],
    });
    this.props.navigation.dispatch(resetAction);
  }

  _onRefreshLanguages = async () => {
    await this.props.getTranslations(this.props.currentLanguage, true);
    await this.props.refreshEnabledLanguages();
    this.resetNav();
  }

  render() {
    const {online, loading, tab, changeTab, lastError, user, refreshUser, localVars, onChangeLocalVars} = this.props;
    let content = null;

    switch (tab) {
      case "user":
        if (equal(lastError, {type: 'object-load', data: {type: 'user', id: user.id}})) {
          content = <MultiLineButton
            onPress={refresh}
            title={i18n("Error loading, please check your connection and try again")}
          />;
          break;
        }

        content = <ScrollView
          style={{flex: 1}}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={refreshUser}/>}
        >
          <Form
            ref="user_form"
            type={{something: t.String}}
            options={{
              label: null,
              stylesheet: formStylesheet,
              fields: [],
            }}
            onChange={() => {
            }}
            value={{}}
          />
          <Button
            primary title="Save"
            onPress={() => {
              console.log('Not implemented yet');
            }}
          />
        </ScrollView>;
        break;

      case "preferences":
        // const onSubmitWithValidation = () => {
        //   if (this.refs.preferences_form.validate().isValid())
        //     submitLocalVars(localVars);
        // };

        const formType = config.debugMode
          ? t.struct({
            downloadFiles: t.Boolean,
            askedToDownloadFiles: t.Boolean,
          })
          : t.struct({
            downloadFiles: t.Boolean,
          });

        const langSelector = <View style={formStylesheet.formGroup.normal}>
          <TranslatedText style={formStylesheet.controlLabel.normal}>Select your language</TranslatedText>
          {!this.props.online && <TranslatedText>Language settings can't be changed while offline</TranslatedText>}
          <MultiSelect
            hideSubmitButton={true}
            hideDropdown={true}
            hideTags={true}
            single={true}
            items={Object.keys(this.props.languageOptions).map(lang => ({
              id: lang,
              name: this.props.languageOptions[lang].native,
              disabled: !this.props.online,
            }))}
            uniqueKey="id"
            onSelectedItemsChange={selected => this._onPress(selected[0])}
            selectedItems={[this.props.currentLanguage]}
            selectText={null}
            selectedItemTextColor="#CCC"
            selectedItemIconColor="#CCC"
            itemTextColor="#000"
            displayKey="name"
            searchInputStyle={{color: '#CCC'}}
          />
        </View>;

        const timeZoneSelector = <View>
          <TranslatedText style={formStylesheet.controlLabel.normal}>Select your timezone</TranslatedText>
          {!this.props.online && <TranslatedText>Language settings can't be changed while offline</TranslatedText>}
          <ModalSelector
            data={timezones.map((tz) => ({key: tz, label: tz}))}
            initValue={this.props.currentTimezone}
            onChange={(tz) => this._onTimezone(tz)}
            disabled={!this.props.online}
          />
        </View>;

        content = <ScrollView style={{flex: 1, padding: 10}}>
          <Form
            ref="preferences_form"
            type={formType}
            options={{
              label: null,
              stylesheet: formStylesheet,
              fields: {
                downloadFiles: {
                  label: i18n.t("Download files"),
                  help: i18n.t("Allows for offline use of documents."),
                  template: singleRowCheckbox,
                },
                askedToDownloadFiles: {
                  label: i18n.t("Asked to download files"),
                  help: i18n.t("Only available in DEBUG mode."),
                  template: singleRowCheckbox,
                },
              },
            }}
            onChange={onChangeLocalVars}
            value={localVars}
          />

          {Object.keys(this.props.languageOptions).length > 1
            ? langSelector
            : null // Hide the language selector if there's just English available
          }
          { timeZoneSelector }
        </ScrollView>;
        break;
    }

    const tabs: tabsDefinition = {
      "user": {label: "Profile"},
      "preferences": {label: "Preferences"},
    };

    return <View style={{flex: 1}}>
      {/*<Tabs
        current={tab}
        changeTab={changeTab}
        tabs={tabs}
      />*/}
      {content}
    </View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#532860',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#b8c',
    borderRadius: 4,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
  },
});

const mapStateToProps = state => ({
  online: state.flags.online,
  enabledLanguages: state.languages.enabled,
  currentLanguage: state.languages.currentLanguage,
  languageOptions: state.languages.enabled,
  lastLocaleUpdate: state.appRemoteConfig.lastLocaleUpdate,
  currentTimezone: 'America/New_York',
});

const mapDispatchToProps = dispatch => ({
  setLanguage: (lang) => dispatch(updadeCurrentLanguage(lang)),
  getTranslations: (lang, forceRefresh = false) => dispatch(getTranslations(lang, forceRefresh)),
  refreshEnabledLanguages: () => dispatch(refreshEnabledLanguages())
});

export default Settings = connect(mapStateToProps, mapDispatchToProps)(Settings);
