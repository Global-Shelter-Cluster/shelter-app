// @flow

import React from 'react';
import {Button, RefreshControl, ScrollView, Text} from 'react-native';
import type {PublicGroupObject} from "../../model/group";
import GroupContextualNavigation from "../../components/GroupContextualNavigation";
import type {FactsheetObject} from "../../model/factsheet";
import equal from 'deep-equal';
import type {lastErrorType} from "../../reducers/lastError";
import GroupDashboardContainer from "../../containers/GroupDashboardContainer";
import Loading from "../../components/Loading";

export default ({online, group, loaded, factsheet, refresh, follow, unfollow, loading, lastError}: {
  online: boolean,
  loading: boolean,
  group: PublicGroupObject,
  loaded: boolean,
  factsheet?: FactsheetObject,
  refresh: () => {},
  follow: () => {},
  unfollow: () => {},
  lastError: lastErrorType,
}) => {
  if (!loaded && equal(lastError, {type: 'object-load', data: {type: 'group', id: group.id}}))
    return <Button
      onPress={refresh}
      title="Error loading, please check your connection and try again"
    />;
  if (!loaded)
    return <Loading/>;

  return <ScrollView
    refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
  >
    <GroupContextualNavigation group={group}/>
    <GroupDashboardContainer group={group} follow={follow} unfollow={unfollow}/>
  </ScrollView>;
}
