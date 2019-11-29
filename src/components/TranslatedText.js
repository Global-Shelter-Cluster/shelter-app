import React, {Component} from 'react';
import {Text} from 'react-native';
import i18n from '../i18n';

class TranslatedText extends Component {

  getTranslation = () => {
    let text = '';
    if (typeof(this.props.children) === "string") {
      text = this.props.children;
    } else {
      text = this.props.text;
    }
    return i18n.t(text, this.props.count, this.props.replacements, this.props.zeroString);
  };

  render() {
    return (
      <Text {...this.props}>{ this.getTranslation() }</Text>
    );
  }
}

export default TranslatedText;
