// @flow

import React from 'react';
import {AppLoading} from 'expo';
import {connect} from 'react-redux';
import {initialize} from "../actions";
import MainNavigator from '../nav';

type Props = {
  dispatch: () => {},
}

class AppContainer extends React.Component<Props> {
  render() {

    if (this.props.initializing)
      return (
        <AppLoading
          startAsync={this.props.initialize}
          onFinish={() => {
          }}
          onError={console.error}
        />
      );

    return <MainNavigator/>;
  }
}

const mapStateToProps = state => ({
  initializing: state.flags.initializing,
});

const mapDispatchToProps = dispatch => {
  return {
    initialize: () => dispatch(initialize()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
