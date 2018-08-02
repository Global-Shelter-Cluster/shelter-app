// @flow

import React from 'react';
import IndicatorRowContainer from '../../containers/IndicatorRowContainer';
import {FlatList, RefreshControl, ScrollView, SectionList, StyleSheet, Text, View} from 'react-native';
import type {PrivateUserObject} from "../../model/user";
import UserContainer from "../../containers/UserContainer";
import GroupListItemContainer from '../../containers/GroupListItemContainer';
import AlertListItemContainer from '../../containers/AlertListItemContainer';
import Collapsible from "../../components/Collapsible";

export default ({loading, user, unseenAlerts, refresh}: {
  loading: boolean,
  user: PrivateUserObject,
  unseenAlerts: Array<number>,
  refresh: () => void,
}) => {
  const alerts = unseenAlerts.length > 0
    ? <Collapsible title="New alerts" badge={unseenAlerts.length} isOpen noHorizontalMargins>
      {unseenAlerts.map(id => <AlertListItemContainer id={id} key={id} isTeaser/>)}
    </Collapsible>
    : null;

  const groups = user.groups !== undefined && user.groups.length > 0
    ? alerts === null
      ? <Collapsible title="Followed" badge={user.groups.length} isOpen noHorizontalMargins>
        {user.groups.map(id => <GroupListItemContainer display="full" id={id} key={id} hideFollowedIndicator/>)}
      </Collapsible>
      : <Collapsible title="Followed" badge={user.groups.length} noHorizontalMargins>
        {user.groups.map(id => <GroupListItemContainer display="full" id={id} key={id} hideFollowedIndicator/>)}
      </Collapsible>
    : null;

  return <View style={{flex: 1}}>
    <ScrollView
      style={{flex: 1}}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
    >
      <UserContainer user={user} showEdit={true}/>
      {alerts}
      {groups}
      {user.groups === undefined
      && <Text style={{textAlign: "center", padding: 40, width: "100%"}}>You're not following any responses yet.</Text>}
    </ScrollView>
    <IndicatorRowContainer/>
  </View>;
};
