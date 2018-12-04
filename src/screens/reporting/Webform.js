// @flow

import React from 'react';
import {Image, Linking, RefreshControl, ScrollView, Share, StyleSheet, Text, View} from 'react-native';
import type {WebformObject} from "../../model/webform";
import {getWebformPageTabs, getWebformTCombData} from "../../model/webform";
import ContextualNavigation from "../../components/ContextualNavigation";
import equal from 'deep-equal';
import type {lastErrorType} from "../../reducers/lastError";
import Button from "../../components/Button";
import vars from "../../vars";
import HTML from 'react-native-render-html';
import {hairlineWidth, propEqual} from "../../util";
import t from "tcomb-form-native";
import Tabs from "../../components/Tabs";

const Form = t.form.Form;

type Props = {
  online: boolean,
  loading: boolean,
  webform: WebformObject,
  page: number,
  formValues: {},
  pagesVisited: { [string]: true }, // e.g. {0: true, 1: true} (we've visited the first 2 pages)
  onChange: () => {},
  onSubmit: () => {},
  onPageChange: () => {},
  refresh: () => void,
  lastError: lastErrorType,
}

export default class Webform extends React.Component<Props> {
// } ({online, webform, page, formValues, onChange, refresh, loading, lastError}: {
// }) => {

  shouldComponentUpdate(nextProps: Props) {
    // We purposefully leave some props out of this, so for example a change from "online" to
    // "offline" won't make our form re-render.
    return !propEqual(this.props, nextProps, ['loading', 'page'], ['webform', 'formValues', 'lastError']);
  }

  render() {
    const {online, loading, page, lastError, webform, refresh, formValues, pagesVisited, onChange, onSubmit, onPageChange} = this.props;

    if (equal(lastError, {type: 'object-load', data: {type: 'webform', id: webform.id}}))
      return <Button
        onPress={refresh}
        title="Error loading, please check your connection and try again"
      />;

    const setFocus = (key: string) => {
      return () => this.refs.form.getComponent(key).refs.input.focus();
    };

    const onSubmitWithValidation = () => {
      if (this.refs.form.validate().isValid())
        onSubmit();
    };

    const changeTab = (tab) => {
      if (this.refs.form.validate().isValid())
        onPageChange(tab);
    };

    const tCombData = getWebformTCombData(webform, page, setFocus, onSubmitWithValidation);
    const tabs = getWebformPageTabs(webform, page, pagesVisited);
    const isLastPage = page === (webform.form.length - 1);

    return <View style={{flex: 1}}>
      <ScrollView
        style={{flex: 1}}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
      >
        <Text style={styles.title}>{webform.title}</Text>
        <ContextualNavigation object={webform}/>
        <View style={styles.info}>
          <View style={{flex: 1}}>
            {webform.description !== undefined && webform.description && <HTML html={webform.description}/>}
          </View>
          <Tabs
            labelOnlyOnActive
            current={'' + page}
            changeTab={changeTab}
            tabs={tabs}
          />
          <Form
            ref="form"
            type={tCombData.type}
            options={{
              label: null,
              stylesheet: formStyles,
              fields: tCombData.fieldOptions,
              order: tCombData.order,
            }}
            onChange={onChange} value={formValues}
          />
          <Button
            primary title={isLastPage ? "Submit" : "Next page"}
            onPress={onSubmitWithValidation}
          />
        </View>
      </ScrollView>
    </View>;
  }
}

const styles = StyleSheet.create({
  info: {
    // flexDirection: "row",
    margin: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
    marginBottom: 5,
    color: vars.SHELTER_RED,
  },
  secondary: {
    color: vars.SHELTER_GREY,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  preview: {
    width: 120,
    height: 120,
    resizeMode: "cover",
    borderWidth: hairlineWidth,
    borderColor: vars.SHELTER_GREY,
    marginRight: 10,
  },
});

const formStyles = {
  ...Form.stylesheet,
  textbox: {
    ...Form.stylesheet.textbox,
    normal: {
      ...Form.stylesheet.textbox.normal,
      borderColor: vars.SHELTER_GREY,
      borderRadius: 2,
    },
    error: {
      ...Form.stylesheet.textbox.error,
      borderColor: vars.ACCENT_RED,
      borderRadius: 2,
    },
  },
};
