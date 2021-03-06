// @flow

import React from 'react';
import {RefreshControl, StyleSheet, Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import type {WebformObject} from "../../model/webform";
import {getWebformPageTabs, getWebformTCombData} from "../../model/webform";
import equal from 'deep-equal';
import type {lastErrorType} from "../../reducers/lastError";
import Button from "../../components/Button";
import MultiLineButton from "../../components/MultiLineButton";
import vars from "../../vars";
import HTML from '../../components/HTML';
import {hairlineWidth, propEqual} from "../../util";
import t from "tcomb-form-native";
import Tabs from "../../components/Tabs";
import Error from "../../components/Error";
import Loading from "../../components/Loading";
import Notice from "../../components/Notice";
import {formStylesheet} from "../../styles/formStyles";
import i18n from "../../i18n";

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
  flattenedValues: {},
  pagesVisited: { [string]: true }, // e.g. {0: true, 1: true} (we've visited the first 2 pages)
  lastError: lastErrorType,
  queued: number, // submissions queued for sending once we go online

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
    return !propEqual(this.props, nextProps, ['loading', 'submitting', 'submitted', 'page', 'queued', 'online'], ['webform', 'formValues', 'lastError', 'flattenedValues']);
  }

  render() {
    let {online, loading, submitting, submitted, page, lastError, webform, refresh, formValues, pagesVisited, onChange, onSubmit, onPageChange, resetForm, resetSubmitted, queued, flattenedValues} = this.props;

    if (equal(lastError, {type: 'object-load', data: {type: 'webform', id: webform.id}}))
      return <MultiLineButton
        onPress={refresh}
        title={i18n.t("Error loading, please check your connection and try again")}
      />;

    let errorMessage: null | string = null;
    if (lastError.type === 'assessment-form-submit' && lastError.data.type === 'webform' && lastError.data.id === webform.id)
      errorMessage = lastError.data.message;

    if (submitting)
      return <Loading/>;

    if (submitted && lastError.type === 'assessment-form-queued' && lastError.data.type === 'webform' && lastError.data.id === webform.id) {
      return <Notice
        action={resetForm}
        buttonLabel={i18n.t("Go back to the form")}
        description={i18n.t("Thank you, your submission has been queued and will be sent when you are online.")}
      />;
    }

    if (submitted && errorMessage !== null) {
      return <Error
        action={onSubmit}
        buttonLabel={i18n.t("Try again")}
        description={errorMessage}
        secondaryButtonLabel={i18n.t("Go back to the form")}
        secondaryAction={resetSubmitted}
      />;
    }

    if (submitted && errorMessage === null) {
      return <Notice
        action={resetForm}
        buttonLabel={i18n.t("Go back to the form")}
        description={i18n.t("Thank you, your submission has been received.")}
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

    const tCombData = getWebformTCombData(webform, page, setFocus, onSubmitWithValidation, flattenedValues);
    const tabs = getWebformPageTabs(webform, page, pagesVisited);
    const isLastPage = webform.form !== undefined ? (page === (webform.form.length - 1)) : true;

    const submitButton = <Button
      primary title={isLastPage ? i18n.t("Submit") : i18n.t("Next page")}
      onPress={onSubmitWithValidation}
    />;

    /* @TODO count arg translation */
    const queuedNotice = queued > 0
      ? <View style={{
        paddingHorizontal: 10,
        justifyContent: "center",
        height: 50,
        backgroundColor: vars.ACCENT_YELLOW,
      }}>
        <Text style={{textAlign: "center"}}>
          {online
            ? (
              queued === 1
                ? "Sending 1 submission…"
                : "Sending " + queued + " submissions…"
            )
            : (
              queued === 1
                ? "1 submission queued\nto be sent when online."
                : queued + " submissions queued\nto be sent when online."
            )
          }
        </Text>
      </View>
      : null;

    return <View style={{flex: 1}}>
      <KeyboardAwareScrollView
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
      >
        <Text style={styles.title}>{webform.title}</Text>
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
          {Object.keys(tCombData.type).length > 0
            ? <Form
              ref="form"
              type={tCombData.type}
              options={{
                label: null,
                stylesheet: formStylesheet,
                fields: tCombData.fieldOptions,
                order: tCombData.order,
                i18n: {
                  optional: '',
                  required: '',
                }
              }}
              onChange={onChange} value={formValues}
            />
            : null
          }
          {submitButton}
        </View>
      </KeyboardAwareScrollView>
      {queuedNotice}
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
