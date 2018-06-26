// @flow

import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import vars from "../vars";
import {hairlineWidth} from "../util";

type Props = {
  title: React$Element<*> | string | null,
  hideTitleWhenOpen?: true,
  separatorAndMargins?: true,
  children: React$Element<*>,
}

type State = {
  open: boolean,
}

export default class Collapsible extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  render() {
    const icon = <FontAwesome
      name={this.state.open ? "minus" : "plus"} size={26} color={vars.SHELTER_RED}
      style={{padding: 7, width: 40, height: 40, marginRight: -10}}
    />;

    const buttonProps = {
      onPress: () => this.setState({open: !this.state.open}),
      activeOpacity: 1,
    };

    const title = typeof this.props.title === 'string'
      ? <Text style={styles.textTitle}>{this.props.title}</Text>
      : this.props.title;

    if (this.state.open) {
      if (this.props.hideTitleWhenOpen)
        return <View style={[{flexDirection: "row"}, this.props.separatorAndMargins ? styles.border : null]}>
          <TouchableOpacity {...buttonProps}>
            {icon}
          </TouchableOpacity>
          <View style={[{flex: 1}, this.props.separatorAndMargins ? styles.contentMargin : null]}>
            {this.props.children}
          </View>
        </View>;
      else
        return <View style={this.props.separatorAndMargins ? styles.border : null}>
          <TouchableOpacity style={{flexDirection: "row"}} {...buttonProps}>
            {icon}
            <View style={{flex: 1}}>
              {title}
            </View>
          </TouchableOpacity>
          <View style={this.props.separatorAndMargins ? styles.contentMargin : null}>
            {this.props.children}
          </View>
        </View>;
    } else {
      return <View style={this.props.separatorAndMargins ? styles.border : null}>
        <TouchableOpacity style={{flexDirection: "row"}} {...buttonProps}>
          {icon}
          <View style={{flex: 1}}>
            {title}
          </View>
        </TouchableOpacity>
      </View>;
    }
  }
}

const styles = StyleSheet.create({
  border: {
    borderColor: vars.LIGHT_GREY,
    borderTopWidth: hairlineWidth,
  },
  textTitle: {
    padding: 10,
    fontSize: 18,
  },
  contentMargin: {
    margin: 10,
    marginLeft: 40,
  },
});
