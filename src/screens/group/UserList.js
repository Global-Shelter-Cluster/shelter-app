// @flow

import React from 'react';
import {FlatList, RefreshControl, SectionList, StyleSheet, Text, View} from 'react-native';
import type {tabsDefinition} from "../../components/Tabs";
import Tabs from "../../components/Tabs";
import vars from "../../vars";
import type {PublicGroupObject} from "../../model/group";
import UserListItemContainer from "../../containers/UserListItemContainer";

export type tabs = "followers";

export default ({online, loading, tab, group, refresh, changeTab}: {
  online: boolean,
  loading: boolean,
  tab: tabs,
  group: PublicGroupObject,
  refresh: () => void,
  changeTab: (tab: tabs) => void,
}) => {
  let ids: Array<number> = [];

  switch (tab) {
    case "followers":
      ids = group.followers ? group.followers : [];
      break;
  }

  const tabs: tabsDefinition = {
    "followers": {label: "Followers"},
  };

  return <View style={{flex: 1}}>
    <Tabs
      current={tab}
      changeTab={changeTab}
      tabs={tabs}
    />
    {ids !== undefined && <FlatList
      key={tab} // This makes the list scroll up when changing the tab.
      data={ids.map(id => ({key: '' + id, id: id}))}
      renderItem={({item}) => <UserListItemContainer id={item.id}/>}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
    />}
  </View>;
  /*const sections: Array<{ title: string | null, data: Array<number> }> = [];

if (unseen.length > 0)
  sections.push({title: null, data: unseen});
if (seen.length > 0)
  sections.push({title: sections.length === 0 ? null : 'Seen', data: seen});

const sectionList = <SectionList
  sections={sections}
  renderSectionHeader={({section}) => section.title === null
    ? null
    : <Text style={styles.sectionHeader}>{section.title}</Text>}
  renderItem={({item}) => <UserListItemContainer id={item}/>}
  keyExtractor={item => '' + item}
/>;

const tabs: tabsDefinition = {
  "new": {label: "Users"},
};

return <View style={{flex: 1}}>
  <Tabs
    current={tab}
    changeTab={changeTab}
    tabs={tabs}
  />
  {sectionList}
</View>;*/
}

// const styles = StyleSheet.create({
//   sectionHeader: {
//     paddingTop: 2,
//     paddingLeft: 10,
//     paddingRight: 10,
//     paddingBottom: 2,
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: vars.MEDIUM_GREY,
//     marginTop: 10,
//   },
// });
