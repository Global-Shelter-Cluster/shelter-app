// @flow

import React from 'react';
import {Button, ScrollView, Text} from 'react-native';
import type {PublicGroupObject} from "../../model/group";
import GroupContextualNavigation from "../../components/GroupContextualNavigation";
import type {FactsheetObject} from "../../model/factsheet";
import equal from 'deep-equal';
import type {lastErrorType} from "../../reducers/lastError";
import GroupDashboardContainer from "../../containers/GroupDashboardContainer";

export default ({online, group, loaded, factsheet, refresh, lastError}: {
  online: boolean,
  group: PublicGroupObject,
  loaded: boolean,
  factsheet?: FactsheetObject,
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

  return <ScrollView>
    <GroupContextualNavigation group={group}/>
    <GroupDashboardContainer id={group.id}/>
  </ScrollView>;
}
