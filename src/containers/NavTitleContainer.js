// @flow

import {connect} from 'react-redux';
import NavTitle from "../components/NavTitle";

const mapStateToProps = state => ({
  online: state.flags.online,
  downloading: {
    value: state.bgProgress.totalCount - state.bgProgress.operationsLeft,
    total: state.bgProgress.totalCount,
    hide: (!state.localVars.downloadFiles && state.bgProgress.totalCount > 0 && state.bgProgress.operationsLeft === state.bgProgress.filesLeft.length),
  },
});

export default connect(mapStateToProps)(NavTitle);
