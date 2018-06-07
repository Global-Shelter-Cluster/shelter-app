// @flow

import React from 'react';
import {connect} from 'react-redux';
import NavTitle from "../components/NavTitle";

const mapStateToProps = state => ({
  online: state.online,
});

export default connect(mapStateToProps)(NavTitle);
