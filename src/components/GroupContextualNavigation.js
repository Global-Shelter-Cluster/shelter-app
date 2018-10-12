// @flow

import React from 'react';
import {SectionList, StyleSheet, Text, View} from 'react-native';
import type {PublicGroupObject} from "../model/group";
import GroupListItemContainer from "../containers/GroupListItemContainer";
import LinkListItemContainer from "../containers/LinkListItemContainer";
import MultipleGroupListItemContainer from "../containers/MultipleGroupListItemContainer";
import NavCollapsible from "./NavCollapsible";
import vars from "../vars";
import {hairlineWidth} from "../util";
import Collapsible from "./Collapsible";

export default ({group, areAllSubregionsCountries}: { group: PublicGroupObject, areAllSubregionsCountries: boolean }) => {
  let groupCount = 0;

  const sections: Array<{ title: string, data?: Array<number | {}>, links?: Array<{ url: string, title?: string }>, isOpen?: true }> = [];

  let collapsedTitle: string | null = null;
  let collapsedContentRow: React$Element<*> | null = null;
  const collapsedSubtitleParts: Array<string> = []; // We comma-separate them later

  // Some helpers
  const plural = (count: number, singularLabel: string, pluralLabel: string) =>
    count === 1 ? '1 ' + singularLabel : count + ' ' + pluralLabel;
  const addCount = (title: string, count: number) =>
    count > 1 ? title + ' (' + count + ')' : title;
  const commaSeparated = (items: Array<string>) => {
    if (items.length === 1)
      return items[0];

    return items.slice(0, -1).join(', ') + ' and ' + items.pop();
  };

  if (group.parent_region) {
    groupCount++;
    sections.push({title: "In", isOpen: true, data: [group.parent_region]});
    if (!collapsedTitle) {
      collapsedTitle = 'In';
      collapsedContentRow = <GroupListItemContainer display="text-only" id={group.parent_region} noLink/>;
    }
  } else if (group.associated_regions) {
    groupCount += group.associated_regions.length;
    sections.push({title: "In", isOpen: true, data: group.associated_regions});
    if (!collapsedTitle) {
      collapsedTitle = addCount('In', group.associated_regions.length);
      collapsedContentRow = <MultipleGroupListItemContainer ids={group.associated_regions}/>;
    }
  }

  if (group.parent_response) {
    groupCount++;
    sections.push({title: "Related to", data: [group.parent_response]});
    if (!collapsedTitle) {
      collapsedTitle = 'Related to';
      collapsedContentRow = <GroupListItemContainer display="text-only" id={group.parent_response} noLink/>;
    }
  }

  const subregionsLabel = areAllSubregionsCountries ? "Countries" : "Regions";
  if (group.response_region_hierarchy && group.regions && group.responses) {
    const section = {title: subregionsLabel + " / responses", data: []};
    const rawIds = [];

    for (let id of group.responses) {
      let found = false;
      for (let data of group.response_region_hierarchy) {
        if (data.responses.includes(id)) {
          found = true;
          break;
        }
      }
      if (!found) {
        section.data.push({id, indent: true});
        rawIds.push(id);
      }
    }

    group.response_region_hierarchy.map(data => {
      section.data.push(data.region);
      rawIds.push(data.region);
      data.responses.map(id => {
        section.data.push({id, indent: true});
        rawIds.push(id);
      });
    });

    if (section.data) {
      groupCount += section.data.length;
      sections.push(section);
      if (!collapsedTitle) {
        collapsedTitle = addCount(subregionsLabel, group.regions.length) + ' / ' + addCount('responses', group.responses.length);
        collapsedContentRow = <MultipleGroupListItemContainer ids={rawIds}/>;
      } else {
        collapsedSubtitleParts.push(plural(group.regions.length, areAllSubregionsCountries ? 'country' : 'region', areAllSubregionsCountries ? 'countries' : 'regions'));
        collapsedSubtitleParts.push(plural(group.responses.length, 'response', 'responses'));
      }
    }

  } else {
    if (group.regions) {
      groupCount += group.regions.length;
      sections.push({title: subregionsLabel, data: group.regions});
      if (!collapsedTitle) {
        collapsedTitle = addCount(subregionsLabel, group.regions.length);
        collapsedContentRow = <MultipleGroupListItemContainer ids={group.regions}/>;
      } else
        collapsedSubtitleParts.push(plural(group.regions.length, areAllSubregionsCountries ? 'country' : 'region', areAllSubregionsCountries ? 'countries' : 'regions'));
    }

    if (group.responses) {
      groupCount += group.responses.length;
      sections.push({title: "Responses", data: group.responses});
      if (!collapsedTitle) {
        collapsedTitle = addCount('Responses', group.responses.length);
        collapsedContentRow = <MultipleGroupListItemContainer ids={group.responses}/>;
      } else
        collapsedSubtitleParts.push(plural(group.responses.length, 'response', 'responses'));
    }
  }

  if (group.hubs) {
    groupCount += group.hubs.length;
    sections.push({title: "Hubs", data: group.hubs});
    if (!collapsedTitle) {
      collapsedTitle = addCount('Hubs', group.hubs.length);
      collapsedContentRow = <MultipleGroupListItemContainer ids={group.hubs}/>;
    } else
      collapsedSubtitleParts.push(plural(group.hubs.length, 'hub', 'hubs'));
  }

  if (group.working_groups) {
    groupCount += group.working_groups.length;
    sections.push({title: "Working groups", data: group.working_groups});
    if (!collapsedTitle) {
      collapsedTitle = addCount('Working groups', group.working_groups.length);
      collapsedContentRow = <MultipleGroupListItemContainer ids={group.working_groups}/>;
    } else
      collapsedSubtitleParts.push(plural(group.working_groups.length, 'working group', 'working groups'));
  }

  if (group.communities_of_practice) {
    groupCount += group.communities_of_practice.length;
    sections.push({title: "Communities of Practice", data: group.communities_of_practice});
    if (!collapsedTitle) {
      collapsedTitle = addCount('Communities of practice', group.communities_of_practice.length);
      collapsedContentRow = <MultipleGroupListItemContainer ids={group.communities_of_practice}/>;
    } else
      collapsedSubtitleParts.push(plural(group.communities_of_practice.length, 'community of practice', 'communities of practice'));
  }

  if (group.strategic_advisory) {
    groupCount++;
    sections.push({title: "Strategic Advisory Group", data: [group.strategic_advisory]});
    if (!collapsedTitle) {
      collapsedTitle = 'Strategic advisory group';
      collapsedContentRow = <GroupListItemContainer display="text-only" id={group.strategic_advisory} noLink/>;
    } else
      collapsedSubtitleParts.push('1 strategic advisory group');
  }

  const collapsibleTitle = <View style={styles.container}>
    <Text style={styles.sectionHeader}>{collapsedTitle}</Text>
    {collapsedContentRow}
    {collapsedSubtitleParts.length > 0 ?
      <Text style={styles.sectionHeader}>+ {commaSeparated(collapsedSubtitleParts)}</Text>
      : null
    }
  </View>;

  if (group.useful_links) {
    sections.push({title: "Useful links", links: group.useful_links});
  }

  if (groupCount === 0)
    return null;

  // const sectionList = <SectionList
  //   style={styles.container}
  //   sections={sections}
  //   renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
  //   renderItem={({item}) => {
  //     if (typeof item === 'object')
  //       return <GroupListItemContainer display="text-only" {...item}/>
  //     else
  //       return <GroupListItemContainer display="text-only" id={item}/>
  //   }}
  //   keyExtractor={(item, index) => index}
  // />;
  const sectionList = [];
  for (const section of sections) {
    const items = [];

    if (section.data)
      for (const item of section.data) {
        if (typeof item === 'object')
          items.push(<GroupListItemContainer key={item.id} display="text-only" {...item}/>);
        else
          items.push(<GroupListItemContainer key={item} display="text-only" id={item}/>);
      }

    if (section.links) {
      let link_counter = 0;
      for (const link of section.links) {
        items.push(<LinkListItemContainer key={link_counter++} {...link}/>);
      }
    }
    console.log('CAM', section, section.title, items);

    sectionList.push(<Collapsible
      key={section.title} title={section.title}
      noHorizontalMargins
      badge={items.length}
      isOpen={section.isOpen || sections.length === 1}
    >
      <View style={{flexDirection: "column"}}>
        {items}
      </View>
    </Collapsible>);
  }

  return <View style={styles.mainContainer}>
    {sectionList}
    {/*{groupCount === 1 ? sectionList :*/}
    {/*<NavCollapsible title={collapsibleTitle}>*/}
    {/*{sectionList}*/}
    {/*</NavCollapsible>*/}
    {/*}*/}
  </View>;
}

const styles = StyleSheet.create({
  mainContainer: {
    // borderColor: vars.LIGHT_GREY,
    // borderBottomWidth: hairlineWidth,
    // borderTopWidth: hairlineWidth,
    // flex: 1,
    // backgroundColor: "yellow",
    // flexDirection: "column",
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
