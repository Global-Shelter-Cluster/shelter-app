// @flow

import React from 'react';
import IndicatorRowContainer from '../../containers/IndicatorRowContainer';
import {FlatList, RefreshControl, ScrollView, SectionList, StyleSheet, Text, View} from 'react-native';
import type {PrivateUserObject} from "../../model/user";
import UserContainer from "../../containers/UserContainer";
import GroupListItemContainer from '../../containers/GroupListItemContainer';
import AlertListItemContainer from '../../containers/AlertListItemContainer';
import Collapsible from "../../components/Collapsible";
import type {AssessmentFormType} from "../../persist";
import WebformListItemContainer from "../../containers/WebformListItemContainer";
import FirstTimeFileDownloadNoticeContainer from "../../containers/FirstTimeFileDownloadNoticeContainer";
import i18n from "../../i18n";
import TranslatedText from "../../components/TranslatedText";

const Dashboard = ({loading, queuedFormSubmissions, user, unseenAlerts, refresh}: {
  loading: boolean,
  queuedFormSubmissions: Array<{ type: AssessmentFormType, id: number, count: number }>,
  user: PrivateUserObject,
  unseenAlerts: Array<number>,
  refresh: () => void,
}) => {
  const totalQueuedSubmissionCount = queuedFormSubmissions.reduce((a, b) => a + b.count, 0);

  const submissions = queuedFormSubmissions.length > 0
    ? <Collapsible
      title={i18n.t("Queued assessment form submissions")}
      badge={totalQueuedSubmissionCount}
      isOpen noHorizontalMargins
    >
      {queuedFormSubmissions.map(data => {
        switch (data.type) {
          case "webform":
            return <WebformListItemContainer
              key={data.type + ':' + data.id} id={data.id}
              showGroup badge={data.count}/>;

          default:
            console.error("Assessment form type not implemented: " + data.type);
        }
      })}
    </Collapsible>
    : null;

  const alerts = unseenAlerts.length > 0
    ? <Collapsible title={i18n.t("New alerts")} badge={unseenAlerts.length} isOpen noHorizontalMargins>
      {unseenAlerts.map(id => <AlertListItemContainer id={id} key={id} isTeaser/>)}
    </Collapsible>
    : null;

  const groups = user.groups !== undefined && user.groups.length > 0
    ? alerts === null
      ? <Collapsible title={i18n.t("Followed")} badge={user.groups.length} isOpen noHorizontalMargins>
        {user.groups.map(id => <GroupListItemContainer display="full" id={id} key={id} hideFollowedIndicator/>)}
      </Collapsible>
      : <Collapsible title={i18n.t("Followed")} badge={user.groups.length} noHorizontalMargins>
        {user.groups.map(id => <GroupListItemContainer display="full" id={id} key={id} hideFollowedIndicator/>)}
      </Collapsible>
    : null;

  return <View style={{flex: 1}}>
    <ScrollView
      style={{flex: 1}}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
    >
      <FirstTimeFileDownloadNoticeContainer/>
      <UserContainer user={user} showEdit={true}/>
      {submissions}
      {alerts}
      {groups}
      {user.groups === undefined
      && <Text style={{textAlign: "center", padding: 40, width: "100%"}}>{i18n.t("You're not following any responses yet.")}</Text>}
    </ScrollView>
    <IndicatorRowContainer/>
  </View>;
};

export default Dashboard;
