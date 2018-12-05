// @flow

import React from 'react';
import {KeyboardAvoidingView, Image, Linking, RefreshControl, ScrollView, Share, StyleSheet, Text, View} from 'react-native';
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
import Error from "../../components/Error";
import Loading from "../../components/Loading";
import Notice from "../../components/Notice";

const Form = t.form.Form;

type Props = {
  // flags
  online: boolean,
  loading: boolean,
  submitting: boolean,
  submitted: boolean,

  // data
  webform: WebformObject,
  page: number,
  formValues: {},
  pagesVisited: { [string]: true }, // e.g. {0: true, 1: true} (we've visited the first 2 pages)
  lastError: lastErrorType,

  // handlers
  onChange: (values: {}) => void,
  onSubmit: () => void,
  onPageChange: (page: number) => void,
  resetForm: () => void,
  resetSubmitted: () => void,
  refresh: () => void,
}

export default class Webform extends React.Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    // We purposefully leave some props out of this, so for example a change from "online" to
    // "offline" won't make our form re-render.
    return !propEqual(this.props, nextProps, ['loading', 'submitting', 'submitted', 'page'], ['webform', 'formValues', 'lastError']);
  }

  render() {
    const {online, loading, submitting, submitted, page, lastError, webform, refresh, formValues, pagesVisited, onChange, onSubmit, onPageChange, resetForm, resetSubmitted} = this.props;

    if (equal(lastError, {type: 'object-load', data: {type: 'webform', id: webform.id}}))
      return <Button
        onPress={refresh}
        title="Error loading, please check your connection and try again"
      />;

    let errorMessage: null | string = null;
    if (lastError.type === 'webform-submit' && lastError.data.id === webform.id)
      errorMessage = lastError.data.message;

    if (submitting)
      return <Loading/>;

    if (submitted && errorMessage !== null) {
      return <Error
        action={onSubmit}
        buttonLabel="Try again"
        description={errorMessage}
        secondaryButtonLabel="Go back to the form"
        secondaryAction={resetSubmitted}
      />;
    }

    if (submitted && errorMessage === null) {
      return <Notice
        action={resetForm}
        buttonLabel="Go back to the form"
        description={"Thank you, your submission\nhas been received."}
      />;
    }

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

    const submitButton = <Button
      primary title={isLastPage ? "Submit" : "Next page"}
      onPress={onSubmitWithValidation}
    />;

    return <View style={{flex: 1}}>
      <ScrollView
        style={{flex: 1}}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
      >
        <Text style={styles.title}>{webform.title}</Text>
        {/*<ContextualNavigation object={webform}/>*/}
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
          {submitButton}
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
  error: {
    color: vars.ACCENT_RED,
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
