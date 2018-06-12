// @flow

import React from 'react';
import {connect} from 'react-redux';
import {changeFlag} from '../actions';
import Test from '../components/Test';

const mapStateToProps = state => ({
  isOnline: state.flags.online,
  downloadProgress: state.downloadProgress,
});

const mapDispatchToProps = dispatch => {
  return {
    doIt: newValue => {
      dispatch(changeFlag('online', newValue));
    },
  };
};

const TestContainer = connect(mapStateToProps, mapDispatchToProps)(Test);

export default TestContainer;
