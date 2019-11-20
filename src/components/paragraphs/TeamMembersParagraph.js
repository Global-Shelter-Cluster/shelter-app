// @flow

import React from 'react';
import {StyleSheet, View} from 'react-native';
import type {
  TeamMembersParagraph as TeamMembersParagraphType,
  TeamMembersParagraphMember
} from "../../model/paragraphs";
import SmartLinkContainer from "../../containers/SmartLinkContainer";

const renderTeamMember = (p: TeamMembersParagraphMember, index: number) => {
  return <View key={index} style={styles.teamContainer}>
    <SmartLinkContainer styleAsContact title={p.name} subtitle={p.org} url={p.link} image={p.photo}/>
  </View>
};

const TeamMembersParagraph = ({paragraph}: { paragraph: TeamMembersParagraphType }) => {
  return <View>
    {paragraph.members.map(renderTeamMember)}
  </View>;
};

export default TeamMembersParagraph;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  teamContainer: {
    paddingVertical: 5,
    paddingLeft: 10,
  },
});
