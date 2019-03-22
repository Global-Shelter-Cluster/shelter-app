import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
// import i18n from '../i18n';

class TranslatedText extends Component {

  getTranslation = () => {
    let text = '';
    if (typeof(this.props.children) === "string") {
      text = this.props.children;
    } else {
      text = this.props.text;
    }
    const translation = this.props.translations[text];
    return translation ? translation : text;
  };

  render() {
    return (
      <Text style={this.props.style}>{ this.getTranslation() }</Text>
    );
  }
}

const mapStateToProps = state => ({
  translations: state.languages.translations,
});

export default connect(mapStateToProps)(TranslatedText);
