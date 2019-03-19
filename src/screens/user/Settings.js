// @flow
import React from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import type {tabsDefinition} from "../../components/Tabs";
import Tabs from "../../components/Tabs";
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
import { setCurrentLanguages, getTranslations } from "../../actions";
import TranslatedText from "../../components/TranslatedText";
import MultiselectFactory from "../../components/tcomb/MultiselectFactory";
import i18n from "../../i18n";
import {FontAwesome} from '@expo/vector-icons';
import vars from "../../vars";

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
  languageOptions: [],
}

type State = {
  languageValue: string,
  languageOptionsOld: {},
  languageOptions: [],
  _languageForm: () => void,
};

class Settings extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      languageValue: props.currentLanguage,
      languageOptionsOld: {
        fields: {
          languages: {
            label: i18n.t("Select your language"),
            single: true,
            choices: this.props.languageOptions,
            factory: MultiselectFactory,
            config: {},
          }
        }
      },
      languageOptions: [],
      _languageForm: () => {},
    };
  }

  shouldComponentUpdate(nextProps: Props) {
    return !propEqual(this.props, nextProps, ['online', 'loading', 'tab', 'currentLanguage'], ['user', 'localVars', 'lastError']);
  }

  _onPress = async (lang)  => {
    this.props.setLanguage(lang);
    await this.props.getTranslations(lang);
    // Reset the navigation and navigating away will show the selected translation.
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Dashboard' })],
    });
    this.props.navigation.dispatch(resetAction);
  }

  _onRefreshLanguages = async () => {
    await this.props.languageOptions.forEach((lang) => this.props.getTranslations(lang, true));
  }

  render() {
    const {online, loading, tab, changeTab, lastError, user, refreshUser, localVars, onChangeLocalVars} = this.props;
    let content = null;

    switch (tab) {
      case "user":
        if (equal(lastError, {type: 'object-load', data: {type: 'user', id: user.id}})) {
          content = <MultiLineButton
            onPress={refresh}
            title={<Text>"Error loading, please check your connection and try again"</Text>}
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

          <TranslatedText text="Select your language" />
          { this.props.languageOptions.map((lang) => (
            <TouchableOpacity
              key={lang}
              style={[styles.option, lang === this.props.currentLanguage ? styles.current: '']}
              onPress={() => this._onPress(lang)}
            >
              <Text style={[lang === this.props.currentLanguage ? styles.textCurrent: '']}>{lang}</Text>
            </TouchableOpacity>
          ))}


          <Button title={i18n.t("Import all translations")} onPress={this._onRefreshLanguages}/>
          <TranslatedText text="App testing string"/>
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
  option: {
    alignItems:'center',
    color: '#000',
    borderRadius: 13,
    borderWidth: 1,
    height: 26,
    justifyContent: 'center',
    margin: 5,
    width: 26,
  },
  current: {
    backgroundColor: vars.MEDIUM_GREY,
    borderWidth: 0,
  },
  textCurrent: {
    color: '#fff',
  },
});

const mapStateToProps = state => ({
  enabledLanguages: state.languages.enabled,
  currentLanguage: state.languages.currentLanguage,
  languageOptions: Object.keys(state.languages.enabled).map((lang) => lang)
});

const mapDispatchToProps = dispatch => ({
  setLanguage: (lang) => dispatch(setCurrentLanguages(lang)),
  getTranslations: (lang, forceRefresh = false) => dispatch(getTranslations(lang, forceRefresh))
});

export default Settings = connect(mapStateToProps, mapDispatchToProps)(Settings);
