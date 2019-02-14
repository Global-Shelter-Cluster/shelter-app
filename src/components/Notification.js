// @flow

import React from 'react';
import {Animated, Easing, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
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
    // Only show notifications in iOS (on Android, they show even if the app is in the foreground. See https://docs.expo.io/versions/latest/guides/push-notifications/)
    if (Platform.OS !== 'ios')
      return null;

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
      <TouchableOpacity onPress={() => {
        enter();
        dismiss();
      }} style={{margin: 10, flex: 1}}>
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
    backgroundColor: vars.WHITE_SEMITRANSPARENT,
    shadowColor: "black",
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 5,
    shadowOpacity: .5,
    elevation: 5, // Shadow works for iOS, elevation for Android
  },
  title: {
    fontWeight: "bold",
    marginBottom: 3,
  },
});
