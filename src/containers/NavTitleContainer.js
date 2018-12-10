// @flow

import {connect} from 'react-redux';
import NavTitle from "../components/NavTitle";

const mapStateToProps = state => ({
  online: state.flags.online,
  downloading: {
    value: state.bgProgress.downloadingCount - state.bgProgress.filesLeft.length,
    total: state.bgProgress.downloadingCount,
  },
});

export default connect(mapStateToProps)(NavTitle);
