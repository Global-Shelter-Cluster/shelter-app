// @flow

import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import ResultHighlight from './ResultHighlight';
import searchResultStyles from "../../styles/searchResultStyles";
import vars from "../../vars";
import {FontAwesome} from '@expo/vector-icons';

export default ContactResult = ({result, enter}) => {
  const lines = [];

  if (result._highlightResult.og_group_ref)
    lines.push(<ResultHighlight
      attribute="og_group_ref[0]" hit={result}
      numberOfLines={1} ellipsizeMode="tail"
    />);

  if (result._highlightResult.field_organisation_name && result._highlightResult.field_role_or_title)
    lines.push(<Text key="org-role">
      <ResultHighlight
        attribute="field_organisation_name[0]" hit={result}
        numberOfLines={1} ellipsizeMode="tail"
      />
      <Text> · </Text>
      <ResultHighlight
        attribute="field_role_or_title[0]" hit={result}
        numberOfLines={1} ellipsizeMode="tail"
      />
    </Text>);
  else if (result._highlightResult.field_organisation_name)
    lines.push(<ResultHighlight
      attribute="field_organisation_name[0]" hit={result}
      numberOfLines={1} ellipsizeMode="tail"
    />);
  else if (result._highlightResult.field_role_or_title)
    lines.push(<ResultHighlight
      attribute="field_role_or_title[0]" hit={result}
      numberOfLines={1} ellipsizeMode="tail"
    />);

  const icons = [];

  if (result._highlightResult.field_email)
    icons.push(<FontAwesome
      key="mail" name={"envelope-o"} size={18} color={vars.MEDIUM_GREY}
    />);

  if (result._highlightResult.field_phone_number)
    icons.push(<FontAwesome
      key="phone" name={"phone"} size={18} color={vars.MEDIUM_GREY}
    />);

  if (result._highlightResult.field_bio)
    icons.push(<FontAwesome
      key="bio" name={"align-left"} size={18} color={vars.MEDIUM_GREY}
    />);

  return <TouchableOpacity onPress={enter} style={searchResultStyles.container}>
    <View style={{flexDirection: "row"}}>
      <ResultHighlight
        style={[searchResultStyles.title, {flex: 1}]} numberOfLines={2} ellipsizeMode="tail"
        attribute="title" hit={result}
      />
      <Text>
        {icons.map((icon, i) => <Text key={i}> {icon}</Text>)}
      </Text>
    </View>
    {lines.map((line, i) => <Text
      key={i} style={searchResultStyles.secondary}
      numberOfLines={1} ellipsizeMode="tail"
    >
      {line}
    </Text>)}
  </TouchableOpacity>;
};
