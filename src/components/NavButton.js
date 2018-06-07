// @flow

import React from 'react';
import {Button, Platform, StyleSheet, View} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';

const NavButton = props => {
  if (props.right && Platform.OS !== 'ios')
    return <View style={{marginRight: 10}}>
      <Button {...props}/>
    </View>;
  else
    return <Button {...props}/>;
};

export default NavButton;
