// @flow

import React from 'react';
import {Button, FlatList, RefreshControl, ScrollView, Text, View} from 'react-native';
import type {PublicGroupObject} from "../../model/group";
import GroupContextualNavigation from "../../components/GroupContextualNavigation";
import type {FactsheetObject} from "../../model/factsheet";
import equal from 'deep-equal';
import type {lastErrorType} from "../../reducers/lastError";
import GroupDashboardContainer from "../../containers/GroupDashboardContainer";
import Loading from "../../components/Loading";
import Error from "../../components/Error";
import Collapsible from "../../components/Collapsible";
import ContactListItemContainer from "../../containers/ContactListItemContainer";

export default ({online, group, loaded, factsheet, refresh, follow, unfollow, loading, lastError, areAllSubregionsCountries}: {
  online: boolean,
  loading: boolean,
  group: PublicGroupObject,
  loaded: boolean,
  factsheet?: FactsheetObject,
  refresh: () => void,
  follow: () => void,
  unfollow: () => void,
  lastError: lastErrorType,
  areAllSubregionsCountries: boolean,
}) => {
  if (!loaded && equal(lastError, {type: 'object-load', data: {type: 'group', id: group.id}}))
    return <Error
      action={refresh}
      buttonLabel="Try again"
      description="Error loading data, please check your connection"
    />;
  if (!loaded)
    return <Loading/>;

  return <ScrollView
    refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
  >
    <GroupContextualNavigation group={group} areAllSubregionsCountries={areAllSubregionsCountries}/>
    <GroupDashboardContainer group={group} follow={follow} unfollow={unfollow}/>
    {group.contacts !== undefined
      ? <Collapsible title="Coordination team" noHorizontalMargins isOpen badge={group.contacts.length}>
        {group.contacts.map(id => <ContactListItemContainer key={id} id={id}/>)}
      </Collapsible>
      : null
    }
  </ScrollView>;
}
