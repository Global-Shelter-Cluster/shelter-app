// @flow

import React from 'react';
import {Image, Linking, RefreshControl, ScrollView, Share, StyleSheet, Text, View} from 'react-native';
import type {PublicEventObject} from "../../model/event";
import ContextualNavigation from "../../components/ContextualNavigation";
import EventActionsContainer from "../../containers/EventActionsContainer";
import equal from 'deep-equal';
import type {lastErrorType} from "../../reducers/lastError";
import vars from "../../vars";
import HTML from 'react-native-render-html';
import moment from "moment/moment";
import Loading from "../../components/Loading";
import {hairlineWidth} from "../../util";
import MultiLineButton from "../../components/MultiLineButton";

export default ({online, event, loaded, refresh, loading, lastError}: {
  online: boolean,
  loading: boolean,
  event: PublicEventObject,
  loaded: boolean,
  refresh: () => void,
  lastError: lastErrorType,
}) => {
  if (!loaded && equal(lastError, {type: 'object-load', data: {type: 'event', id: event.id}}))
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
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.secondary}>{moment(event.date).utc().format('D MMM YYYY, h:mm a')}</Text>
      <ContextualNavigation object={event}/>
      <View style={styles.info}>
        <View style={{flex: 1}}>
          {event.address !== undefined && event.address && <HTML html={event.address}/>}
        </View>
        {event.map !== undefined && event.map &&
        <Image key="map" style={styles.map} source={{uri: event.map}}/>}
      </View>
      <View style={{margin: 10}}>
        {event.description !== undefined && event.description && <HTML html={event.description}/>}
      </View>
    </ScrollView>
    <EventActionsContainer event={event}/>
  </View>;
}

const styles = StyleSheet.create({
  info: {
    flexDirection: "row",
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
  map: {
    width: 120,
    height: 120,
    resizeMode: "cover",
    borderWidth: hairlineWidth,
    borderColor: vars.SHELTER_GREY,
    marginLeft: 10,
  },
});
