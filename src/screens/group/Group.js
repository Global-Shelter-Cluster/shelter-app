// @flow

import React from 'react';
import TestContainer from '../../containers/TestContainer';
import {Button, ImageBackground, Text, View} from 'react-native';
import type {PublicGroupObject} from "../../model/group";
import GroupContextualNavigation from "../../components/GroupContextualNavigation";
import type {FactsheetObject} from "../../model/factsheet";
import equal from 'deep-equal';
import type {lastErrorType} from "../../reducers/lastError";

export default ({online, group, loaded, factsheet, refresh, lastError}: {
  online: boolean,
  group: PublicGroupObject,
  loaded: boolean,
  factsheet ?: FactsheetObject,
  refresh: number => {},
  lastError: lastErrorType,
}) => {
  if (!loaded && equal(lastError, {type: 'object-load', data: {type: 'group', id: group.id}}))
    return <Button
      onPress={() => refresh(group.id)}
      title="Error loading, please check your connection and try again"
    />;
  if (!loaded)
    return <Text>Loading...</Text>;

  return <View style={{flex: 1}}>
    <GroupContextualNavigation group={group}/>
    <ImageBackground
      source={factsheet ? {uri: factsheet.image} : null}
      style={{width: 300, height: 300}}
    >
      <Text>online: {online ? 'on' : 'off'}</Text>
      <Text>group id: {group.id}</Text>
      <Text>group: {JSON.stringify(group)}</Text>
      <TestContainer/>
    </ImageBackground>
  </View>;
}
