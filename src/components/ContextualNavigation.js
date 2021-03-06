// @flow

import React from 'react';
import {SectionList, StyleSheet, View} from 'react-native';
import type {PublicDocumentObject} from "../model/document";
import GroupListItemContainer from "../containers/GroupListItemContainer";
import MultipleGroupListItemContainer from "../containers/MultipleGroupListItemContainer";
import NavCollapsible from "./NavCollapsible";
import vars from "../vars";
import {hairlineWidth} from "../util";
import type {PublicEventObject} from "../model/event";
import type {PublicFactsheetObject} from "../model/factsheet";
import type {ContactObject} from "../model/contact";
import type {PageObject} from "../model/page";
import type {NewsObject} from "../model/news";
import TranslatedText from "./TranslatedText";

export default ContextualNavigation = ({object}: { object: PublicDocumentObject | PublicEventObject | PublicFactsheetObject | ContactObject | PageObject | NewsObject }) => {
  if (!object.groups)
    return null;

  let groupCount = 0;
  if (object.groups)
    groupCount += object.groups.length;

  const sections: Array<{ title: string, data: Array<number> }> = [];
  let collapsibleTitle: React$Element<*> | null = null;

  if (object.groups) {
    sections.push({title: "In", data: object.groups});
    if (!collapsibleTitle) {
      collapsibleTitle = <View style={styles.container}>
        <TranslatedText style={styles.sectionHeader}>In</TranslatedText>
        <MultipleGroupListItemContainer ids={object.groups}/>
      </View>;
    }
  }

  const sectionList = <SectionList
    style={styles.container}
    sections={sections}
    renderSectionHeader={({section}) => <TranslatedText style={styles.sectionHeader}>{section.title}</TranslatedText>}
    renderItem={({item}) => <GroupListItemContainer display="text-only" id={item}/>}
    keyExtractor={(item, index) => index}
  />;

  return <View style={styles.mainContainer}>
    {groupCount === 1 ? sectionList :
      <NavCollapsible title={collapsibleTitle}>
        {sectionList}
      </NavCollapsible>
    }
  </View>;
}

const styles = StyleSheet.create({
  mainContainer: {
    borderColor: vars.LIGHT_GREY,
    borderBottomWidth: hairlineWidth,
    borderTopWidth: hairlineWidth,
  },
  container: {
    marginTop: 10
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    color: vars.MEDIUM_GREY,
  },
});
