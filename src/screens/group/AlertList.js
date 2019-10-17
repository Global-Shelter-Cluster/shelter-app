// @flow

import React from 'react';
import {SectionList, StyleSheet, Text, View} from 'react-native';
import AlertListItemContainer from "../../containers/AlertListItemContainer";
import NewsListItemContainer from "../../containers/NewsListItemContainer";
import type {tabsDefinition} from "../../components/Tabs";
import Tabs from "../../components/Tabs";
import vars from "../../vars";
import Notice from "../../components/Notice";
import i18n from "../../i18n";

export type tabs = "alerts" | "news";

export default ({online, loading, tab, seenAlerts, unseenAlerts, seenNews, unseenNews, refresh, changeTab}: {
  online: boolean,
  loading: boolean,
  tab: tabs,
  seenAlerts: Array<number>,
  unseenAlerts: Array<number>,
  seenNews: Array<number>,
  unseenNews: Array<number>,
  refresh: () => void,
  changeTab: (tab: tabs) => void,
}) => {
  let content = null;

  switch (tab) {
    case "alerts": {
      const sections: Array<{ title: string | null, data: Array<number> }> = [];

      if (unseenAlerts.length > 0)
        sections.push({title: null, data: unseenAlerts});
      if (seenAlerts.length > 0)
        sections.push({title: sections.length === 0 ? null : 'Seen', data: seenAlerts});

      content = <SectionList
        sections={sections}
        renderSectionHeader={({section}) => section.title === null
          ? null
          : <Text style={styles.sectionHeader}>{section.title}</Text>}
        renderItem={({item}) => <AlertListItemContainer id={item}/>}
        keyExtractor={item => '' + item}
      />;

      if (!sections.length) {
        content = <Notice
          description={i18n.t("There are no recent alerts for this group.")}
        />;
      }

      break;
    }
    case "news": {
      const sections: Array<{ title: string | null, data: Array<number> }> = [];

      if (unseenNews.length > 0)
        sections.push({title: null, data: unseenNews});
      if (seenNews.length > 0)
        sections.push({title: sections.length === 0 ? null : 'Seen', data: seenNews});

      content = <SectionList
        sections={sections}
        renderSectionHeader={({section}) => section.title === null
          ? null
          : <Text style={styles.sectionHeader}>{section.title}</Text>}
        renderItem={({item}) => <NewsListItemContainer id={item}/>}
        keyExtractor={item => '' + item}
      />;

      if (!sections.length) {
        content = <Notice
          description={i18n.t("There are no recent news for this group.")}
        />;
      }

      break;
    }
  }

  const tabs: tabsDefinition = {
    "alerts": {label: "Alerts"},
    "news": {label: "News"},
  };

  return <View style={{flex: 1}}>
    <Tabs
      current={tab}
      changeTab={changeTab}
      tabs={tabs}
    />
    {content}
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
