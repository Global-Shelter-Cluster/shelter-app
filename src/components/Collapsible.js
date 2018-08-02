// @flow

import React from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';

type Props = {
  title: React$Element<*> | string | null,
  children: React$Element<*>,
  isOpen?: true,
  noHorizontalMargins?: true,
  badge?: string, // Only works when title is a string
}

type State = {
  open: boolean,
}

export default class Collapsible extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      open: props.isOpen ? true : false,
    };
  }

  render() {
    const buttonProps = {
      onPress: () => this.setState({open: !this.state.open}),
      activeOpacity: 1,
    };

    const title = typeof this.props.title === 'string'
      ? <Text style={styles.textTitle}>
        <Text style={styles.monospace}>{this.state.open ? '-' : '+'}</Text>
        {' ' + this.props.title.toUpperCase()}
        {this.props.badge && !this.state.open ? ' (' + this.props.badge + ')' : null}
      </Text>
      : this.props.title;

    if (this.state.open) {
      return <View>
        <TouchableOpacity style={styles.titleWrapperOpen} {...buttonProps}>
          {title}
        </TouchableOpacity>
        <View style={this.props.noHorizontalMargins ? styles.contentMarginNoHorizontal : styles.contentMargin}>
          {this.props.children}
        </View>
      </View>;
    } else {
      return <View>
        <TouchableOpacity style={styles.titleWrapper} {...buttonProps}>
          {title}
        </TouchableOpacity>
      </View>;
    }
  }
}

const styles = StyleSheet.create({
  monospace: Platform.OS === 'ios'
    ? {
      fontFamily: "Courier",
    }
    : {
      fontFamily: "monospace",
    },
  titleWrapper: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#d7d7d7",
    marginHorizontal: 10,
    marginTop: 15,
    paddingBottom: 5,
  },
  titleWrapperOpen: {
    flex: 1,
    borderBottomWidth: 2,
    borderColor: "#717171",
    marginHorizontal: 10,
    marginTop: 15,
    paddingBottom: 5,
  },
  textTitle: {
    // padding: 10,
    fontSize: 14,
    fontWeight: "bold",
    color: "#313131",
  },
  contentMargin: {
    margin: 10,
    marginLeft: 40,
  },
  contentMarginNoHorizontal: {
    marginVertical: 10,
  },
});
