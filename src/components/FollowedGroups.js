// @flow

import React from 'react';
import {FlatList} from 'react-native';
import GroupListItemContainer from '../containers/GroupListItemContainer';

export default ({ids}: { ids: Array<number> }) => (
  <FlatList
    data={ids.map(id => ({key: '' + id, id: id}))}
    renderItem={({item}) => <GroupListItemContainer id={item.id}/>}
  />
);
