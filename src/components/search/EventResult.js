// @flow

import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import ResultHighlight from './ResultHighlight';
import searchResultStyles from "../../styles/searchResultStyles";
import moment from "moment/moment";

export default EventResult = ({result, enter}) => {
  const lines = [];

  if (result._highlightResult.og_group_ref)
    lines.push(<ResultHighlight
      attribute="og_group_ref[0]" hit={result}
      numberOfLines={1} ellipsizeMode="tail"
    />);

  lines.push(moment(result.event_date * 1000).utc().format('D MMM YYYY'));

  let location = '';
  if (result['field_postal_address:postal_code'])
    location += ' ' + result['field_postal_address:postal_code'];
  if (result['field_postal_address:locality'])
    location += ' ' + result['field_postal_address:locality'];
  if (result['field_postal_address:country'])
    location += ' ' + result['field_postal_address:country'];
  location = location.trim();
  if (location)
    lines[lines.length - 1] += " · " + location;

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
