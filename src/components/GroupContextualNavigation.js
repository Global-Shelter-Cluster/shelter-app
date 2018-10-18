// @flow

import React from 'react';
import {View} from 'react-native';
import type {PublicGroupObject} from "../model/group";
import GroupListItemContainer from "../containers/GroupListItemContainer";
import LinkListItemContainer from "../containers/LinkListItemContainer";
import Collapsible from "./Collapsible";

export default ({group, areAllSubregionsCountries}: { group: PublicGroupObject, areAllSubregionsCountries: boolean }) => {
  let groupCount = 0;

  const sections: Array<{ title: string, data?: Array<number | {}>, links?: Array<{ url: string, title?: string }>, isOpen?: true }> = [];

  if (group.parent_region) {
    groupCount++;
    sections.push({title: "In", isOpen: true, data: [group.parent_region]});
  } else if (group.associated_regions) {
    groupCount += group.associated_regions.length;
    sections.push({title: "In", isOpen: true, data: group.associated_regions});
  }

  if (group.parent_response) {
    groupCount++;
    sections.push({title: "Related to", data: [group.parent_response]});
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
    }

  } else {
    if (group.regions) {
      groupCount += group.regions.length;
      sections.push({title: subregionsLabel, data: group.regions});
    }

    if (group.responses) {
      groupCount += group.responses.length;
      sections.push({title: "Responses", data: group.responses});
    }
  }

  if (group.hubs) {
    groupCount += group.hubs.length;
    sections.push({title: "Hubs", data: group.hubs});
  }

  if (group.working_groups) {
    groupCount += group.working_groups.length;
    sections.push({title: "Working groups", data: group.working_groups});
  }

  if (group.communities_of_practice) {
    groupCount += group.communities_of_practice.length;
    sections.push({title: "Communities of Practice", data: group.communities_of_practice});
  }

  if (group.strategic_advisory) {
    groupCount++;
    sections.push({title: "Strategic Advisory Group", data: [group.strategic_advisory]});
  }

  if (group.useful_links) {
    sections.push({title: "Useful links", links: group.useful_links});
  }

  if (groupCount === 0)
    return null;

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

  return <View>
    {sectionList}
  </View>;
}
