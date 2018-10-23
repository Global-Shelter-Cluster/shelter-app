// @flow

import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import ResultHighlight from './ResultHighlight';
import searchResultStyles from "../../styles/searchResultStyles";
import moment from "moment/moment";

export default PageResult = ({result, enter}) => {
  const lines = [];

  if (result._highlightResult.og_group_ref)
    lines.push(<ResultHighlight
      attribute="og_group_ref[0]" hit={result}
      numberOfLines={1} ellipsizeMode="tail"
    />);

  const types = {
    'arbitrary_library': 'Library',
    'library': 'Library',
    'article': 'Article',
    'page': null,
    'discussion': 'Discussion',
    'homepage': null
  };

  if (types[result.type] !== undefined && types[result.type])
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
