// @flow

import React from 'react';
import {SectionList, StyleSheet, Text, View} from 'react-native';
import type {PublicGroupObject} from "../model/group";
import GroupListItemContainer from "../containers/GroupListItemContainer";
import MultipleGroupListItemContainer from "../containers/MultipleGroupListItemContainer";
import NavCollapsible from "./NavCollapsible";
import vars from "../vars";
import {hairlineWidth} from "../util";

export default ({group}: { group: PublicGroupObject }) => {
  let groupCount = 0;

  const sections: Array<{ title: string, data: Array<number> }> = [];
  let collapsibleTitle: React$Element<*> | null = null;

  if (group.parent_region) {
    groupCount++;
    sections.push({title: "In", data: [group.parent_region]});
    if (!collapsibleTitle) {
      collapsibleTitle = <View style={styles.container}>
        <Text style={styles.sectionHeader}>In</Text>
        <GroupListItemContainer display="text-only" id={group.parent_region} noLink/>
      </View>;
    }
  } else if (group.associated_regions) {
    groupCount += group.associated_regions.length;
    sections.push({title: "In", data: group.associated_regions});
    if (!collapsibleTitle) {
      collapsibleTitle = <View style={styles.container}>
        <Text style={styles.sectionHeader}>In</Text>
        <MultipleGroupListItemContainer ids={group.associated_regions}/>
      </View>;
    }
  }

  if (group.parent_response) {
    groupCount++;
    sections.push({title: "Related to", data: [group.parent_response]});
    if (!collapsibleTitle) {
      collapsibleTitle = <View style={styles.container}>
        <Text style={styles.sectionHeader}>Related to</Text>
        <GroupListItemContainer display="text-only" id={group.parent_response} noLink/>
      </View>;
    }
  }

  if (group.regions) {
    groupCount += group.regions.length;
    sections.push({title: "Regions", data: group.regions});
    if (!collapsibleTitle) {
      collapsibleTitle = <View style={styles.container}>
        <Text style={styles.sectionHeader}>Regions</Text>
        <MultipleGroupListItemContainer ids={group.regions}/>
      </View>;
    }
  }

  if (group.responses) {
    groupCount += group.responses.length;
    sections.push({title: "Responses", data: group.responses});
    if (!collapsibleTitle) {
      collapsibleTitle = <View style={styles.container}>
        <Text style={styles.sectionHeader}>Responses</Text>
        <MultipleGroupListItemContainer ids={group.responses}/>
      </View>;
    }
  }

  if (group.hubs) {
    groupCount += group.hubs.length;
    sections.push({title: "Hubs", data: group.hubs});
    if (!collapsibleTitle) {
      collapsibleTitle = <View style={styles.container}>
        <Text style={styles.sectionHeader}>Hubs</Text>
        <MultipleGroupListItemContainer ids={group.hubs}/>
      </View>;
    }
  }

  if (group.working_groups) {
    groupCount += group.working_groups.length;
    sections.push({title: "Working groups", data: group.working_groups});
    if (!collapsibleTitle) {
      collapsibleTitle = <View style={styles.container}>
        <Text style={styles.sectionHeader}>Working groups</Text>
        <MultipleGroupListItemContainer ids={group.working_groups}/>
      </View>;
    }
  }

  if (group.communities_of_practice) {
    groupCount += group.communities_of_practice.length;
    sections.push({title: "Communities of Practice", data: group.communities_of_practice});
    if (!collapsibleTitle) {
      collapsibleTitle = <View style={styles.container}>
        <Text style={styles.sectionHeader}>Communities of practice</Text>
        <MultipleGroupListItemContainer ids={group.communities_of_practice}/>
      </View>;
    }
  }

  if (group.strategic_advisory) {
    groupCount++;
    sections.push({title: "Strategic Advisory Group", data: [group.strategic_advisory]});
    if (!collapsibleTitle) {
      collapsibleTitle = <View style={styles.container}>
        <Text style={styles.sectionHeader}>Strategic advisory group</Text>
        <GroupListItemContainer display="text-only" id={group.strategic_advisory} noLink/>
      </View>;
    }
  }

  if (groupCount === 0)
    return null;

  const sectionList = <SectionList
    style={styles.container}
    sections={sections}
    renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
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
