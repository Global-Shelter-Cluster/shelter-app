// @flow

import React from 'react';
import {FlatList} from 'react-native';
import GroupListItemContainer from '../containers/GroupListItemContainer';

export default ({ids, navigation}: { ids: Array<number>, navigation: {} }) => (
  <FlatList
    data={ids.map(id => ({key: '' + id, id: id}))}
    renderItem={({item}) => <GroupListItemContainer id={item.id} navigation={navigation}/>}
  />
);
