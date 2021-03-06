// @flow

import React from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import ContextualNavigation from "../../components/ContextualNavigation";
import PageActionsContainer from "../../containers/PageActionsContainer";
import equal from 'deep-equal';
import type {lastErrorType} from "../../reducers/lastError";
import vars from "../../vars";
import moment from "moment/moment";
import Loading from "../../components/Loading";
import MultiLineButton from "../../components/MultiLineButton";
import Paragraphs from "../../components/paragraphs/Paragraphs";
import type {PublicBasicPageObject} from "../../model/page";
import HTML from "../../components/HTML";

export default ({online, page, loaded, refresh, loading, lastError}: {
  online: boolean,
  loading: boolean,
  page: PublicBasicPageObject,
  loaded: boolean,
  refresh: () => void,
  lastError: lastErrorType,
}) => {
  if (!loaded && equal(lastError, {type: 'object-load', data: {type: 'page', id: page.id}}))
    return <MultiLineButton
      onPress={refresh}
      title="Error loading, please check your connection and try again"
    />;
  if (!loaded)
    return <Loading/>;

  return <View style={{flex: 1}}>
    <ScrollView
      style={{flex: 1}}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
    >
      <Text style={styles.title}>{page.title}</Text>
      <Text style={styles.secondary}>{moment(page.date).utc().format('D MMM YYYY')}</Text>
      <ContextualNavigation object={page}/>
      <View style={{marginHorizontal: 10}}>
        {page.body ? <HTML html={page.body}/> : null}
        {page.content ? <Paragraphs paragraphs={page.content}/> : null}
      </View>
    </ScrollView>
    <PageActionsContainer page={page}/>
  </View>;
}

const styles = StyleSheet.create({
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
});
