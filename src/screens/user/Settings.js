// @flow
import React from 'react';
import {RefreshControl, ScrollView, StyleSheet, View} from 'react-native';
import {NavigationActions, StackActions} from 'react-navigation';
import ModalSelector from 'react-native-modal-selector'
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
import TranslatedText from "../../components/TranslatedText";
import MultiselectFactory from "../../components/tcomb/MultiselectFactory";
import i18n from "../../i18n";
import MultiSelect from "../../components/Multiselect";
import persist from "../../persist";
import type {GlobalObject} from "../../model/global";
import Notice from "../../components/Notice";
import Error from "../../components/Error";

const Form = t.form.Form;

export type tabs = "user" | "preferences" | "notifications";

const defaultTimezone = 'America/New_York';

type Props = {
  online: boolean,
  loading: boolean,
  tab: tabs,
  changeTab: (tab: tabs) => void,
  lastError: lastErrorType,

  global: GlobalObject,
  user: PrivateUserObject,
  refreshUser: () => void,
  refreshGlobal: () => void,
  updateUser: values => void,

  localVars: localVarsType,
  // submitLocalVars: () => void,
  onChangeLocalVars: () => void,

  enabledLanguages: {},
  currentLanguage: String,
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

  async _changeLanguage(language: string) {
    this.props.setLanguage(language);
    await this.props.getTranslations(language);
    this.props.updateUser({language});
    this.resetNav();
  }

  async _changeTimezone(timezone: string) {
    this.props.updateUser({timezone});
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

  async onChangeNotifications(newValues) {
    const notifications = {
      app_daily: !!newValues.app_daily,
      app_upcoming_events: !!newValues.app_upcoming_events,
      email_daily: !!newValues.email_daily,
      email_weekly: !!newValues.email_weekly,
    };

    // This ugly block of code is just to make the user happy by trying to guess their intentions. Just .. trust it.

    const oldValues = this.props.user.notifications;

    if (!notifications.app_daily && !notifications.app_upcoming_events && (oldValues.app_daily || oldValues.app_upcoming_events))
      newValues.app = false;
    if (!notifications.email_daily && !notifications.email_weekly && (oldValues.email_daily || oldValues.email_weekly))
      newValues.email = false;

    if (newValues.app && !notifications.app_daily && !notifications.app_upcoming_events) {
      notifications.app_daily = true;
      notifications.app_upcoming_events = true;
    }
    if (!newValues.app) {
      notifications.app_daily = false;
      notifications.app_upcoming_events = false;
    }

    if (newValues.email && !notifications.email_daily && !notifications.email_weekly)
      notifications.email_daily = true;
    if (!newValues.email) {
      notifications.email_daily = false;
      notifications.email_weekly = false;
    }

    // Ugly code ends here.

    this.props.updateUser({notifications});
  }

  render() {
    const {online, loading, tab, changeTab, lastError, global, user, refreshUser, refreshGlobal, localVars, onChangeLocalVars} = this.props;
    let content = null;

    switch (tab) {
      case "user": {
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
      }
      case "preferences": {
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
            onSelectedItemsChange={selected => this._changeLanguage(selected[0])}
            selectedItems={[this.props.currentLanguage]}
            selectText={null}
            selectedItemTextColor="#CCC"
            selectedItemIconColor="#CCC"
            itemTextColor="#000"
            displayKey="name"
            searchInputStyle={{color: '#CCC'}}
          />
        </View>;

        const timeZoneSelector = global.timezones
          ? <View>
            <TranslatedText style={formStylesheet.controlLabel.normal}>Select your timezone</TranslatedText>
            {!this.props.online && <TranslatedText>Timezone can't be changed while offline</TranslatedText>}
            <ModalSelector
              data={global.timezones.map((tz) => ({key: tz, label: tz}))}
              initValue={user.timezone ? user.timezone : defaultTimezone}
              onChange={(tz) => this._changeTimezone(tz.key)}
              disabled={!this.props.online}
            />
          </View>
          : null;

        content = <ScrollView
          style={{flex: 1}}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={() => {
            refreshGlobal();
            refreshUser();
          }}/>}
        >
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
          {timeZoneSelector}
        </ScrollView>;
        break;
      }
      case "notifications": {
        const formType = t.struct({
          app: t.Boolean,
          app_daily: t.Boolean,
          app_upcoming_events: t.Boolean,
          email: t.Boolean,
          email_daily: t.Boolean,
          email_weekly: t.Boolean,
        });

        const notificationVars = {
          app_daily: user.notifications && user.notifications.app_daily,
          app_upcoming_events: user.notifications && user.notifications.app_upcoming_events,
          email_daily: user.notifications && user.notifications.email_daily,
          email_weekly: user.notifications && user.notifications.email_weekly,
        };
        notificationVars.app = (notificationVars.app_daily || notificationVars.app_upcoming_events);
        notificationVars.email = (notificationVars.email_daily || notificationVars.email_weekly);

        const fieldsOptions = {
          app: {
            label: i18n.t("Push notifications"),
            template: singleRowCheckbox,
          },
          app_daily: {
            label: i18n.t("  Daily digest"),
            template: singleRowCheckbox,
            hidden: !notificationVars.app,
          },
          app_upcoming_events: {
            label: i18n.t("  Upcoming events"),
            template: singleRowCheckbox,
            hidden: !notificationVars.app,
          },
          email: {
            label: i18n.t("--Email notifications"),
            template: singleRowCheckbox,
          },
          email_daily: {
            label: i18n.t("  Daily digest"),
            template: singleRowCheckbox,
            hidden: !notificationVars.email,
          },
          email_weekly: {
            label: i18n.t("  Weekly digest"),
            template: singleRowCheckbox,
            hidden: !notificationVars.email,
          },
        };

        content = <ScrollView
          style={{flex: 1}}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={refreshUser}/>}
        >
          <Form
            ref="notifications_form"
            type={formType}
            options={{
              label: null,
              stylesheet: formStylesheet,
              fields: fieldsOptions,
            }}
            onChange={this.onChangeNotifications.bind(this)}
            value={notificationVars}
          />
        </ScrollView>;

        if (!online)
          content = <Error description={i18n.t("Offline")}/>;

        break;
      }
    }

    const tabs: tabsDefinition = {
      // "user": {
      //   label: "Profile",
      //   icon: "user",
      // },
      "preferences": {
        label: "Preferences",
        icon: "cog",
      },
      "notifications": {
        label: "Notifications",
        icon: "bell",
      },
    };

    return <View style={{flex: 1, paddingHorizontal: 10}}>
      <Tabs
        labelOnlyOnActive
        current={tab}
        changeTab={changeTab}
        tabs={tabs}
      />
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

export default Settings;
