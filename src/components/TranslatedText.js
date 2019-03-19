import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
// import i18n from '../i18n';

class TranslatedText extends Component {

  getTranslation = () => {
    const translation = this.props.translations[this.props.text];
    return translation ? translation: this.props.text;
  };

  render() {
    return (
      <View>
        <Text style={this.props.style}>{ this.getTranslation() }</Text>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  translations: state.languages.translations,
});

export default connect(mapStateToProps)(TranslatedText);
