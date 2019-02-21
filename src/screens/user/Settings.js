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

const Form = t.form.Form;

export type tabs = "user" | "preferences";

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
}

export default class Settings extends React.Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return !propEqual(this.props, nextProps, ['online', 'loading', 'tab'], ['user', 'localVars', 'lastError']);
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

        content = <ScrollView style={{flex: 1, padding: 10}}>
          <Form
            ref="preferences_form"
            type={t.struct({
              downloadFiles: t.Boolean,
            })}
            options={{
              label: null,
              stylesheet: formStylesheet,
              fields: {
                downloadFiles: {
                  label: "Download files",
                  help: "Allows for offline use of documents.",
                  template: singleRowCheckbox,
                },
              },
            }}
            onChange={onChangeLocalVars}
            value={localVars}
          />
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
