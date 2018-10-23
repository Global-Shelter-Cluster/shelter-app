// @flow

import React from 'react';
import {View} from 'react-native';
import type {PublicGroupObject} from "../model/group";
import PageListItemContainer from "../containers/PageListItemContainer";

export default ({group}: { group: PublicGroupObject }) => {
  if (group.pages === undefined)
    return null;

  const list = [];

  for (const id of group.pages) {
    list.push(<PageListItemContainer key={id} id={id}/>);

    if (group.all_child_pages !== undefined && group.all_child_pages[id] !== undefined) {
      for (const child_id of group.all_child_pages[id])
        list.push(<PageListItemContainer key={child_id} id={child_id} indent/>);
    }
  }

  return <View>
    {list}
  </View>;
}
