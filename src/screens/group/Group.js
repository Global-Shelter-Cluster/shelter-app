// @flow

import React from 'react';
import {Button, FlatList, RefreshControl, ScrollView, Text, View} from 'react-native';
import type {PublicGroupObject} from "../../model/group";
import GroupContextualNavigation from "../../components/GroupContextualNavigation";
import type {FactsheetObject} from "../../model/factsheet";
import equal from 'deep-equal';
import type {lastErrorType} from "../../reducers/lastError";
import GroupDashboardContainer from "../../containers/GroupDashboardContainer";
import GroupActionsContainer from "../../containers/GroupActionsContainer";
import Loading from "../../components/Loading";
import Error from "../../components/Error";
import Collapsible from "../../components/Collapsible";
import ContactListItemContainer from "../../containers/ContactListItemContainer";
import type {tabsDefinition} from "../../components/Tabs";
import Tabs from "../../components/Tabs";

export type tabs = "dashboard" | "pages" | "nav";

export default ({online, group, loaded, tab, changeTab, factsheet, refresh, loading, lastError, areAllSubregionsCountries}: {
  online: boolean,
  loading: boolean,
  group: PublicGroupObject,
  loaded: boolean,
  tab: tabs,
  changeTab: (tab: tabs) => void,
  factsheet?: FactsheetObject,
  refresh: () => void,
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

  const tabs: tabsDefinition = {
    "dashboard": {label: "Dashboard"},
    // "pages": {label: "Pages"}, // TODO: implement
    "nav": {label: "Navigation"},
  };

  let content;

  switch (tab) {
    case "pages":
      break;

    case "nav":
      content = <ScrollView
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
      >
        <GroupContextualNavigation
          group={group}
          areAllSubregionsCountries={areAllSubregionsCountries}
        />
      </ScrollView>;
      break;

    case "dashboard":
    default:
      content = <View style={{flex: 1}}>
        <ScrollView
          refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
        >
          <GroupDashboardContainer group={group}/>
          {group.contacts !== undefined
            ? <Collapsible title="Coordination team" noHorizontalMargins isOpen badge={group.contacts.length}>
              {group.contacts.map(id => <ContactListItemContainer key={id} id={id}/>)}
            </Collapsible>
            : null
          }
        </ScrollView>
        <GroupActionsContainer group={group}/>
      </View>;
  }

  return <View style={{flex: 1}}>
    <Tabs
      current={tab}
      changeTab={changeTab}
      tabs={tabs}
    />
    {content}
  </View>;
}
