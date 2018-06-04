// @flow

import React from 'react';
import {SectionList, StyleSheet, Text, View} from 'react-native';
import type {PublicGroupObject} from "../model/group";
import GroupListItemContainer from "../containers/GroupListItemContainer";
import MultipleGroupListItemContainer from "../containers/MultipleGroupListItemContainer";
import Collapsible from "./Collapsible";
import vars from "../vars";

export default ({group}: { group: PublicGroupObject }) => {
  if (!group.parent_region && !group.parent_response && !group.associated_regions)
    return null;

  let groupCount = 0;
  if (group.parent_region)
    groupCount++;
  if (group.associated_regions)
    groupCount += group.associated_regions.length;
  if (group.parent_response)
    groupCount++;

  const sections: Array<{ title: string, data: Array<number> }> = [];
  let collapsibleTitle: React$Element<*> | null = null;

  if (group.parent_region) {
    sections.push({title: "In", data: [group.parent_region]});
    if (!collapsibleTitle) {
      collapsibleTitle = <View>
        <Text style={styles.sectionHeader}>In</Text>
        <GroupListItemContainer display="text-only" id={group.parent_region} noLink/>
      </View>;
    }
  } else if (group.associated_regions) {
    sections.push({title: "In", data: group.associated_regions});
    if (!collapsibleTitle) {
      collapsibleTitle = <View>
        <Text style={styles.sectionHeader}>In</Text>
        <MultipleGroupListItemContainer ids={group.associated_regions}/>
      </View>;
    }
  }

  if (group.parent_response) {
    sections.push({title: "Related to", data: [group.parent_response]});
    if (!collapsibleTitle) {
      collapsibleTitle = <View>
        <Text style={styles.sectionHeader}>Related to</Text>
        <GroupListItemContainer display="text-only" id={group.parent_response} noLink/>
      </View>;
    }
  }

  const sectionList = <SectionList
    sections={sections}
    renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
    renderItem={({item}) => <GroupListItemContainer display="text-only" id={item}/>}
    keyExtractor={(item, index) => index}
  />;

  return <View style={{borderBottomColor: vars.LIGHT_GREY, borderBottomWidth: .5}}>
    {groupCount === 1 ? sectionList :
      <Collapsible title={collapsibleTitle} hideTitleWhenOpen>
        {sectionList}
      </Collapsible>
    }
  </View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    color: vars.SHELTER_GREY,
  },
  item: {
    padding: 10,
    paddingTop: 0,
    fontSize: 18,
  },
});
