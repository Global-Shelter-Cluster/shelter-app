// @flow

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {changeOnlineStatus} from '../actions';
import Test from '../components/Test';

const mapStateToProps = state => ({
  isOnline: state.online,
  downloadProgress: state.downloadProgress,
});

const mapDispatchToProps = dispatch => {
  return {
    doIt: newValue => {
      dispatch(changeOnlineStatus(newValue));
    },
  };
};

const TestContainer = connect(mapStateToProps, mapDispatchToProps)(Test);

export default TestContainer;
