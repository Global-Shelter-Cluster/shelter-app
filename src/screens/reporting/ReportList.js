// @flow

import React from 'react';
import {FlatList, RefreshControl, View} from 'react-native';
import type {PrivateGroupObject} from "../../model/group";
import KoboFormListItemContainer from "../../containers/KoboFormListItemContainer";
import WebformListItemContainer from "../../containers/WebformListItemContainer";
import type {tabsDefinition} from "../../components/Tabs";
import Tabs from "../../components/Tabs";
import {hairlineWidth} from "../../util";
import vars from "../../vars";
import type {ObjectRequest} from "../../persist";
import i18n from "../../i18n";

export default ({loading, group, refresh}: {
  loading: boolean,
  group: PrivateGroupObject,
  refresh: () => void,
}) => {
  const tabs: tabsDefinition = {
    "all": {label: i18n.t("Data collection")},
  };
  const tab = 'all';

  const objects: Array<ObjectRequest> = [
    ...(group.webforms ? group.webforms.filter(item => !!item).map(id => ({type: 'webform', id})) : []),
    ...(group.kobo_forms ? group.kobo_forms.filter(item => !!item).map(id => ({type: 'kobo_form', id})) : []),
  ];

  if (objects.length > 0)
    objects.push(-1);

  return <View style={{flex: 1}}>
    <Tabs
      current={tab}
      changeTab={() => {}}
      tabs={tabs}
    />
    <FlatList
      data={objects}
      keyExtractor={item => item !== -1 ? item.type + ':' + item.id : 'end'}
      renderItem={({item}) => {
        if (item === -1)
          return <View style={{
            borderColor: vars.LIGHT_GREY,
            borderTopWidth: hairlineWidth,
          }}/>;

        switch (item.type) {
          case 'kobo_form':
            return <KoboFormListItemContainer id={item.id}/>;
          case 'webform':
            return <WebformListItemContainer id={item.id}/>;
          default:
            console.error('Unrecognized item', item);
        }
      }}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
    />
  </View>;
}
