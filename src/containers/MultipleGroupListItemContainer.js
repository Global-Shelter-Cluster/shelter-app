// @flow

import React from 'react';
import {connect} from 'react-redux';
import GroupListItem from '../components/GroupListItem';
import {getObject} from "../model";
import {withNavigation} from 'react-navigation';

// This is not a very clean component, but it works for a very specific use: when the current group has more than one
// "associated_regions", it shows a "fake GroupListItem" with all the regions separated by comma, e.g. "Haiti,
// Caribbean, Americas".

const mapStateToProps = (state, props) => {
  const commaSeparated = (items: Array<string>) => {
    if (items.length === 1)
      return items[0];

    return items.slice(0, -1).join(', ') + ' and ' + items.pop();
  };

  const group = {
    title: commaSeparated(props.ids.map(id => getObject(state, 'group', id).title)),
  };

  return {
    display: "text-only",
    group: group,
    link: false,
    factsheet: null,
    enter: null,
  };
};

export default withNavigation(connect(mapStateToProps)(GroupListItem));
