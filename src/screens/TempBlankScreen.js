// @flow

import React from 'react';
import {connect} from 'react-redux';
import {FontAwesome} from '@expo/vector-icons';
import {Text} from 'react-native';
import NavTitleContainer from "../containers/NavTitleContainer";

type Props = {}

const mapStateToProps = (state, props) => ({});

const mapDispatchToProps = (dispatch, props) => ({});

class TempBlankScreen extends React.Component<Props> {
  static navigationOptions = {
    headerTitle: <NavTitleContainer title="Not implemented yet!"/>,
  };

  render() {
    return <Text style={{margin: 50}}>Not implemented yet!</Text>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TempBlankScreen);
