// @flow

import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import vars from "../vars";
import type {UrlString} from "../model";
import FitImage from "react-native-fit-image";

const defaultContactImage = require("../../assets/contact.png");

export default ({title, subtitle, enter, linkType, image, styleAsContact}: {
  title?: string,
  subtitle?: string,
  enter?: () => {},
  linkType?: 'document' | 'event' | 'factsheet' | 'kobo_form' | 'webform' | 'group' | 'url' | 'email' | 'tel',
  image?: UrlString,
  styleAsContact?: true,
}) => {
  const contents = [];

  if (styleAsContact) {
    const contactImage = image
      ? <Image key="picture" style={styles.contactImage} source={{uri: image}}/>
      : <Image key="picture" style={styles.contactImage} source={image}/>;

    contents.push(contactImage);
  }

  if (title || subtitle)
    contents.push(
      <View key="info" style={styles.info}>
        {title
          ? <Text numberOfLines={image ? 8 : 4} ellipsizeMode="tail"
                  style={[styles.title]}>{title}</Text>
          : null
        }
        {subtitle
          ? <Text numberOfLines={image ? 8 : 4} ellipsizeMode="tail"
                  style={[styles.secondary]}>{subtitle}</Text>
          : null
        }
      </View>
    );

  if (image && !styleAsContact)
    contents.push(
      <FitImage
        key="image"
        source={{uri: image}}
        style={{}} // For some reason removing this makes the image not show. Who knows why...
      />
    );

  const icons = {
    'document': "file-o",
    'event': "calendar",
    'factsheet': "bar-chart",
    'kobo_form': "pencil-square-o",
    'webform': "pencil-square-o",
    'group': "users",
    'url': "globe",
    'email': "envelope-o",
    'tel': "phone",
  };

  const linkTypeIcon = linkType !== undefined && icons[linkType] !== undefined
    ? <FontAwesome
      name={icons[linkType]} size={18} color={vars.MEDIUM_GREY}
      style={styles.rightArrow}
    />
    : null;

  const isClickable = enter !== undefined;

  if (isClickable) {
    return <TouchableOpacity
      style={styleAsContact ? styles.contactContainer : styles.container}
      onPress={enter}
    >
      {contents}
      {image && !styleAsContact ? null : linkTypeIcon}
      <FontAwesome
        name={"angle-right"} size={18} color={vars.MEDIUM_GREY}
        style={styles.rightArrow}
      />
    </TouchableOpacity>;
  } else {
    return <View style={styleAsContact ? styles.contactContainer : styles.container}>
      {contents}
      {image && !styleAsContact ? null : linkTypeIcon}
    </View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 10,
    marginLeft: 10,
    borderColor: vars.SHELTER_GREY,
  },
  contactContainer: {
    flexDirection: "row",
    borderColor: vars.SHELTER_GREY,
  },
  info: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 4,
  },
  secondary: {
    color: vars.SHELTER_GREY,
  },
  rightArrow: {
    paddingLeft: 10,
    paddingTop: 2,
  },
  contactImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: vars.SHELTER_GREY,
    marginRight: 10,
  },
});
