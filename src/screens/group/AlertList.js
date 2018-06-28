// @flow

import React from 'react';
import {FlatList, RefreshControl, SectionList, StyleSheet, Text, View} from 'react-native';
import AlertListItemContainer from "../../containers/AlertListItemContainer";
import type {tabsDefinition} from "../../components/Tabs";
import Tabs from "../../components/Tabs";
import vars from "../../vars";

export type tabs = "new";

export default ({online, loading, tab, seen, unseen, refresh, changeTab}: {
  online: boolean,
  loading: boolean,
  tab: tabs,
  seen: Array<number>,
  unseen: Array<number>,
  refresh: () => {},
  changeTab: (tab: string) => {},
}) => {
  const sections: Array<{ title: string | null, data: Array<number> }> = [];

  if (unseen.length > 0)
    sections.push({title: null, data: unseen});
  if (seen.length > 0)
    sections.push({title: sections.length === 0 ? null : 'Seen', data: seen});

  const sectionList = <SectionList
    sections={sections}
    renderSectionHeader={({section}) => section.title === null
      ? null
      : <Text style={styles.sectionHeader}>{section.title}</Text>}
    renderItem={({item}) => <AlertListItemContainer id={item}/>}
    keyExtractor={item => '' + item}
  />;

  const tabs: tabsDefinition = {
    "new": {label: "Alerts"},
  };

  return <View style={{flex: 1}}>
    <Tabs
      current={tab}
      changeTab={changeTab}
      tabs={tabs}
    />
    {sectionList}
  </View>;
}

const styles = StyleSheet.create({
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    color: vars.MEDIUM_GREY,
    marginTop: 10,
  },
});
