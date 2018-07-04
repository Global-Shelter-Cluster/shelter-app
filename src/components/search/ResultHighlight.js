// @flow

import React from 'react';
import {Text} from 'react-native';
import {connectHighlight} from 'react-instantsearch/connectors';

export default ResultHighlight = connectHighlight(
  ({highlight, attribute, hit, style, numberOfLines, ellipsizeMode}) => {
    const parsedHit = highlight({
      attribute,
      hit,
      highlightProperty: '_highlightResult',
    });
    const highlightedHit = parsedHit.map((part, idx) => {
      if (part.isHighlighted)
        return (
          <Text key={idx} style={{fontWeight: 'bold'}}>
            {part.value}
          </Text>
        );
      return part.value;
    });
    return <Text style={style} numberOfLines={numberOfLines} ellipsizeMode={ellipsizeMode}>
      {highlightedHit}
    </Text>;
  }
);
