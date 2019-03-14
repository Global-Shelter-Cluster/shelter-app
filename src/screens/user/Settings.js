// @flow
import React from 'react';
import {FlatList, RefreshControl, ScrollView, Text, View} from 'react-native';
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
  languageOptions: {},
  _languageForm: () => void,
};

class Settings extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      languageValue: props.currentLanguage,
      languageOptions: {
        fields: {
          languages: {
            label: 'Select your language',
            single: true,
            choices: this.props.languageOptions,
            factory: MultiselectFactory,
            config: {},
          }
        }
      },
      _languageForm: () => {},
    };
  }

  shouldComponentUpdate(nextProps: Props) {
    return !propEqual(this.props, nextProps, ['online', 'loading', 'tab', 'currentLanguage'], ['user', 'localVars', 'lastError']);
  }

  _onChangeLanguage = () => {
    const selectedLanguage = this._languageForm.getValue().languages[0];
    const lang = this.props.languageOptions[selectedLanguage];
    this.props.setLanguage(lang);
    this.props.getTranslations(lang);
  }

  render() {
    const {online, loading, tab, changeTab, lastError, user, refreshUser, localVars, onChangeLocalVars} = this.props;
    let content = null;

    switch (tab) {
      case "user":
        if (equal(lastError, {type: 'object-load', data: {type: 'user', id: user.id}})) {
          content = <MultiLineButton
            onPress={refresh}
            title="Error loading, please check your connection and try again"
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
                  label: "Download files",
                  help: "Allows for offline use of documents.",
                  template: singleRowCheckbox,
                },
                askedToDownloadFiles: {
                  label: "Asked to download files",
                  help: "Only available in DEBUG mode.",
                  template: singleRowCheckbox,
                },
              },
            }}
            onChange={onChangeLocalVars}
            value={localVars}
          />
          <Form
            ref={(ref) => this._languageForm = ref}
            type={languageModel}
            options={this.state.languageOptions}
            value={this.state.languageValue}
            onChange={this._onChangeLanguage}
          />
          <Text>Current language: {this.props.currentLanguage}</Text>
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

const mapStateToProps = state => ({
  enabledLanguages: state.languages.enabled,
  currentLanguage: state.languages.currentLanguage,
  languageOptions: Object.keys(state.languages.enabled).map((lang) => lang)
});

const mapDispatchToProps = dispatch => ({
  setLanguage: (lang) => dispatch(setCurrentLanguages(lang)),
  getTranslations: (lang) => dispatch(getTranslations(lang))
});

export default Settings = connect(mapStateToProps, mapDispatchToProps)(Settings);
