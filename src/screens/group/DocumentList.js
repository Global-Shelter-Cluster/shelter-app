// @flow

import React from 'react';
import {FlatList, Text, View} from 'react-native';
import type {PublicGroupObject} from "../../model/group";
import DocumentListItemContainer from "../../containers/DocumentListItemContainer";

export default ({online, which, group}: {
  online: boolean,
  which: "recent" | "featured" | "key",
  group: PublicGroupObject,
}) => {
  let ids: Array<number> = [];

  switch (which) {
    case "recent":
      ids = group.recent_documents;
      break;
    case "featured":
      ids = group.featured_documents;
      break;
    case "key":
      ids = group.key_documents;
      break;
  }

  return <View>
    <Text>tabs...({which}):</Text>
    <FlatList
      data={ids.map(id => ({key: '' + id, id: id}))}
      renderItem={({item}) => <DocumentListItemContainer id={item.id}/>}
    />
  </View>;
}
