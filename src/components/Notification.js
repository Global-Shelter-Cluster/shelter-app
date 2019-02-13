// @flow

import React from 'react';
import {Animated, Easing, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import vars from "../vars";
import {FontAwesome} from '@expo/vector-icons';
import type {notificationType} from "../reducers/notification";

type Props = {
  show: boolean,
  notification: notificationType | null,
  enter: () => void,
  dismiss: () => void,
};

export default class Notification extends React.Component<Props> {
  render() {
    const {show, notification, enter, dismiss} = this.props;

    if (!show || !notification)
      return null;

    const animatedValue = new Animated.Value(0);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    const translateY = animatedValue.interpolate({inputRange: [0, 1], outputRange: [-10, 30]});
    const opacity = animatedValue.interpolate({inputRange: [0, 1], outputRange: [0, 1]});

    const innerContainer = <Animated.View
      style={[styles.innerContainer, {
        transform: [{translateY}],
        opacity,
      }]}>
      <TouchableOpacity onPress={enter} style={{margin: 10, flex: 1}}>
        <Text style={styles.title}>{notification.title}</Text>
        {notification.body
          ? <Text>{notification.body}</Text>
          : null
        }
      </TouchableOpacity>
      <TouchableOpacity onPress={dismiss} style={{padding: 10}}>
        <FontAwesome name="times" size={18} color={vars.LIGHT_GREY}/>
      </TouchableOpacity>
    </Animated.View>;

    return <View
      style={styles.outerContainer}>
      {innerContainer}
    </View>;
  }
};

const styles = StyleSheet.create({
  outerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    paddingHorizontal: 5,
  },
  innerContainer: {
    width: "100%",
    maxHeight: 150,
    flexDirection: "row",
    borderRadius: 5,
    backgroundColor: vars.ACCENT_YELLOW_SEMITRANSPARENT,
    overflow: "hidden",
  },
  title: {
    fontWeight: "bold",
    marginBottom: 3,
  },
});
