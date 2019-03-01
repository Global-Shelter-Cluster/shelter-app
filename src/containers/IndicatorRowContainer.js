// @flow

import React from 'react';
import {connect} from 'react-redux';
import {changeFlag} from '../actions';
import IndicatorRow from '../components/IndicatorRow';

const mapStateToProps = state => ({
  online: state.flags.online,
  bgProgress: state.bgProgress,
  fileDownloadsDisabled: !state.localVars.downloadFiles,
});

const mapDispatchToProps = dispatch => {
  return {
    setOnline: newValue => {
      dispatch(changeFlag('online', newValue));
    },
  };
};

const IndicatorRowContainer = connect(mapStateToProps, mapDispatchToProps)(IndicatorRow);

export default IndicatorRowContainer;
