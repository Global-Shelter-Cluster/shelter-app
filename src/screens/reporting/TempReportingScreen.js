// @flow

import React from 'react';
import {connect} from 'react-redux';
import {FontAwesome} from '@expo/vector-icons';
import {WebView} from 'react-native';

type Props = {}

const mapStateToProps = (state, props) => ({});

const mapDispatchToProps = (dispatch, props) => ({});

class TempReportingScreen extends React.Component<Props> {
  static navigationOptions = ({navigation}) => {
    return {
      title: "Not implemented yet!",
    };
  };

  render() {
    return <WebView
      source={{uri: 'https://ee.humanitarianresponse.info/x/#XfkA2YFa'}}
      style={{marginTop: 20}}
    />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TempReportingScreen);
