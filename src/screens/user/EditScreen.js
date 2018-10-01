// @flow

import React from 'react';
import {Text, View} from 'react-native';
import analytics from "../../analytics";
import {PageHit} from "expo-analytics";

type Props = {}

class EditScreen extends React.Component<Props> {

  componentDidMount() {
    this.props.navigation.addListener(
      'didFocus',
      payload => analytics.hit(new PageHit(payload.state.routeName)),
    );
  }

  render() {
    return <View>
      <Text>Edit user</Text>
    </View>;
  }
}

export default EditScreen;
