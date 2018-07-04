// @flow

import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import ResultHighlight from './ResultHighlight';
import searchResultStyles from "../../styles/searchResultStyles";
import moment from "moment/moment";

export default DocumentResult = ({result, enter}) => {
  const lines = [];

  if (result._highlightResult.og_group_ref)
    lines.push(<ResultHighlight
      attribute="og_group_ref[0]" hit={result}
      numberOfLines={1} ellipsizeMode="tail"
    />);

  if (result.document_date !== undefined)
    lines.push(moment(result.document_date * 1000).utc().format('D MMM YYYY'));
  else
    lines.push('');
  if (result.field_featured)
    lines[lines.length - 1] += " · Featured";
  if (result.field_key_document && !result.field_featured)
    lines[lines.length - 1] += " · Key document";

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
