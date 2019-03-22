// @flow

import React from 'react';
import {Button, FlatList, RefreshControl, ScrollView, Text, View} from 'react-native';
import type {PublicGroupObject} from "../../model/group";
import GroupContextualNavigation from "../../components/GroupContextualNavigation";
import GroupPagesNavigation from "../../components/GroupPagesNavigation";
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
import i18n from "../../i18n";

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
      buttonLabel={i18n.t("Try again")}
      description={i18n.t("Error loading data, please check your connection")}
    />;
  if (!loaded)
    return <Loading/>;

  const tabs: tabsDefinition = {
    "dashboard": {label: i18n.t("Dashboard")},
    "pages": {label: i18n.t("Pages")},
    "nav": {label: i18n.t("Navigation")},
  };

  if (group.pages === undefined)
    delete tabs.pages;

  let content;

  switch (tab) {
    case "pages":
      content = <ScrollView
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
      >
        <GroupPagesNavigation group={group}/>
      </ScrollView>;
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
            ? <Collapsible title={i18n.t("Coordination team")} noHorizontalMargins isOpen badge={group.contacts.length}>
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
