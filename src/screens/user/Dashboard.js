// @flow

import React from 'react';
import IndicatorRowContainer from '../../containers/IndicatorRowContainer';
import {FlatList, RefreshControl, ScrollView, SectionList, StyleSheet, Text, View} from 'react-native';
import type {PrivateUserObject} from "../../model/user";
import UserContainer from "../../containers/UserContainer";
import GroupListItemContainer from '../../containers/GroupListItemContainer';
import AlertListItemContainer from '../../containers/AlertListItemContainer';
import vars from "../../vars";
import {hairlineWidth} from "../../util";

export default ({loading, user, unseenAlerts, refresh}: {
  loading: boolean,
  user: PrivateUserObject,
  unseenAlerts: Array<number>,
  refresh: () => {},
}) => {
  const sections: Array<{ title: string, data: Array<{ type: string, id: number }> }> = [];

  if (unseenAlerts.length > 0)
    sections.push({title: "New alerts", data: unseenAlerts.map(id => ({type: 'alert', id}))});

  if (user.groups !== undefined && user.groups.length > 0)
    sections.push({title: "Followed", data: user.groups.map(id => ({type: 'group', id}))});

  const sectionList = <SectionList
    sections={sections}
    renderSectionHeader={({section}) => sections.length > 1 ?
      <Text style={styles.sectionHeader}>{section.title}</Text> : null}
    renderItem={({item}) => {
      switch (item.type) {
        case 'alert':
          return <AlertListItemContainer id={item.id} showGroupAndSkipMarkingAsSeen/>;
        case 'group':
          return <GroupListItemContainer display="full" id={item.id}/>;
      }
    }}
    keyExtractor={item => [item.type, item.id].join(':')}
  />;

  return <View style={{flex: 1}}>
    <ScrollView
      style={{flex: 1}}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
    >
      <UserContainer user={user} showEdit={true}/>
      {sectionList}
      {user.groups === undefined
      && <Text style={{textAlign: "center", padding: 40, width: "100%"}}>You're not following any responses yet.</Text>}
    </ScrollView>
    <IndicatorRowContainer/>
  </View>;
};

const styles = StyleSheet.create({
  mainContainer: {
    borderColor: vars.LIGHT_GREY,
    borderBottomWidth: hairlineWidth,
    borderTopWidth: hairlineWidth,
  },
  container: {
    marginTop: 20
  },
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
