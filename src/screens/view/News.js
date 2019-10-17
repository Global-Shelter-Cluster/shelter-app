// @flow

import React from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import type {PublicNewsObject} from "../../model/news";
import ContextualNavigation from "../../components/ContextualNavigation";
import NewsActionsContainer from "../../containers/NewsActionsContainer";
import equal from 'deep-equal';
import type {lastErrorType} from "../../reducers/lastError";
import vars from "../../vars";
import moment from "moment/moment";
import Loading from "../../components/Loading";
import MultiLineButton from "../../components/MultiLineButton";
import Paragraphs from "../../components/paragraphs/Paragraphs";

export default ({online, news, loaded, refresh, loading, lastError}: {
  online: boolean,
  loading: boolean,
  news: PublicNewsObject,
  loaded: boolean,
  refresh: () => void,
  lastError: lastErrorType,
}) => {
  if (!loaded && equal(lastError, {type: 'object-load', data: {type: 'news', id: news.id}}))
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
      <Text style={styles.title}>{news.title}</Text>
      <Text style={styles.secondary}>{moment(news.date).utc().format('D MMM YYYY')}</Text>
      <ContextualNavigation object={news}/>
      <View style={{marginHorizontal: 10}}>
        <Paragraphs paragraphs={news.content}/>
      </View>
    </ScrollView>
    <NewsActionsContainer news={news}/>
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
