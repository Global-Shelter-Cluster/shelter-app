// @flow

import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import ResultHighlight from './ResultHighlight';
import searchResultStyles from "../../styles/searchResultStyles";
import moment from "moment/moment";

export default GroupResult = ({result, enter}) => {
  const lines = [];

  const types = {
    'community_of_practice': 'Community of practice',
    'geographic_region': 'Geographic region',
    'hub': 'Hub',
    'response': 'Response',
    'discussion': 'Discussion',
    'strategic_advisory': 'Strategic Advisory Group',
    'working_group': 'Working Group'
  };

  if (types[result.type] !== undefined)
    lines.push(types[result.type]);

  return <TouchableOpacity onPress={enter} style={searchResultStyles.container}>
    <ResultHighlight
      style={searchResultStyles.title} numberOfLines={2} ellipsizeMode="tail"
      attribute="title" hit={result}
    />
    {lines.map((line, i) => <Text
      key={i} style={searchResultStyles.secondary}
      numberOfLines={1} ellipsizeMode="tail"
    >
      {line}
    </Text>)}
  </TouchableOpacity>;
};
