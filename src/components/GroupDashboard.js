// @flow

import React from 'react';
import {View} from 'react-native';
import DashboardBlock from './DashboardBlock';

const GroupDashboard = ({blocks}: { blocks: Array<{ title: string, icon: string, action: () => {} }> }) => (
  <View style={{
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 10,
  }}>
    {blocks.map((block, i) => <DashboardBlock key={i} {...block}/>)}
  </View>
);

export default GroupDashboard;
