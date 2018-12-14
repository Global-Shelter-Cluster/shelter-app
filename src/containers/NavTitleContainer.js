// @flow

import {connect} from 'react-redux';
import NavTitle from "../components/NavTitle";

const mapStateToProps = state => ({
  online: state.flags.online,
  downloading: {
    value: state.bgProgress.totalCount - state.bgProgress.filesLeft.length,
    total: state.bgProgress.totalCount,
  },
});

export default connect(mapStateToProps)(NavTitle);
