// @flow

import {connect} from 'react-redux';
import NavTitle from "../components/NavTitle";

const mapStateToProps = state => ({
  online: state.flags.online,
  downloading: {
    value: state.downloadProgress.downloadingCount - state.downloadProgress.filesLeft.length,
    total: state.downloadProgress.downloadingCount,
  },
});

export default connect(mapStateToProps)(NavTitle);
